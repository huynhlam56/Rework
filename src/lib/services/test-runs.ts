import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
import { db } from "@/lib/db";
import type { TestResultStatus } from "@/generated/prisma/enums";
import { toPlaywrightSelector } from "@/lib/services/test-catalog";

const execFileAsync = promisify(execFile);
const PLAYWRIGHT_BIN = path.join(process.cwd(), "node_modules", ".bin", "playwright");
const RESULTS_PATH = path.join(process.cwd(), "test-results", "results.json");

type FlatSpecResult = {
  file: string;
  title: string;
  status: TestResultStatus;
  durationMs: number;
  errorMessage: string | null;
};

type PlaywrightTestResult = {
  duration: number;
  errors?: { message?: string }[];
};

type PlaywrightTest = {
  status: "expected" | "unexpected" | "flaky" | "skipped";
  results?: PlaywrightTestResult[];
};

type PlaywrightSpec = {
  file: string;
  title: string;
  tests?: PlaywrightTest[];
};

type PlaywrightSuite = {
  specs?: PlaywrightSpec[];
  suites?: PlaywrightSuite[];
};

function flattenSuite(suite: PlaywrightSuite, out: FlatSpecResult[]) {
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests ?? []) {
      const lastResult = test.results?.[test.results.length - 1];
      const status: TestResultStatus = test.status === "unexpected" ? "FAILED" : test.status === "skipped" ? "SKIPPED" : "PASSED";

      out.push({
        file: spec.file,
        title: spec.title,
        status,
        durationMs: lastResult?.duration ?? 0,
        errorMessage: lastResult?.errors?.[0]?.message ?? null,
      });
    }
  }

  for (const child of suite.suites ?? []) {
    flattenSuite(child, out);
  }
}

export async function triggerLocalTestRun(selectedTestIds: string[] = []) {
  const run = await db.testRun.create({
    data: { status: "RUNNING", trigger: "MANUAL", startedAt: new Date() },
  });

  const selectors = selectedTestIds.map(toPlaywrightSelector);
  const args = ["test", "--reporter=json", ...selectors];

  let stdout = "";
  let stderr = "";
  try {
    const result = await execFileAsync(PLAYWRIGHT_BIN, args, {
      cwd: process.cwd(),
      env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: RESULTS_PATH },
      maxBuffer: 1024 * 1024 * 20,
    });
    stdout = result.stdout;
    stderr = result.stderr;
  } catch (error) {
    const execError = error as { stdout?: string; stderr?: string };
    stdout = execError.stdout ?? "";
    stderr = execError.stderr ?? "";
  }

  try {
    const raw = await fs.readFile(RESULTS_PATH, "utf-8");
    const report = JSON.parse(raw) as { suites?: PlaywrightSuite[] };

    const specResults: FlatSpecResult[] = [];
    for (const suite of report.suites ?? []) {
      flattenSuite(suite, specResults);
    }

    if (specResults.length === 0) {
      throw new Error("Playwright report contained no test results.");
    }

    await db.testResult.createMany({
      data: specResults.map((r) => ({
        runId: run.id,
        testFile: r.file,
        testTitle: r.title,
        status: r.status,
        durationMs: r.durationMs,
        errorMessage: r.errorMessage,
      })),
    });

    const hasFailure = specResults.some((r) => r.status === "FAILED");
    await db.testRun.update({
      where: { id: run.id },
      data: { status: hasFailure ? "FAILED" : "PASSED", finishedAt: new Date() },
    });
  } catch (parseError) {
    const message = parseError instanceof Error ? parseError.message : String(parseError);
    await db.testRun.update({
      where: { id: run.id },
      data: {
        status: "ERRORED",
        finishedAt: new Date(),
        errorMessage: `${message}\n${stderr || stdout}`.slice(0, 2000),
      },
    });
  }

  return db.testRun.findUniqueOrThrow({ where: { id: run.id } });
}

export function listTestRuns() {
  return db.testRun.findMany({
    orderBy: { createdAt: "desc" },
    include: { results: { select: { status: true } } },
  });
}

export function getTestRunById(id: string) {
  return db.testRun.findUnique({
    where: { id },
    include: { results: { orderBy: { testFile: "asc" } } },
  });
}
