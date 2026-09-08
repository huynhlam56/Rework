import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const execFileAsync = promisify(execFile);
const PLAYWRIGHT_BIN = path.join(process.cwd(), "node_modules", ".bin", "playwright");
const TEST_DIR = "tests/e2e";

export type CatalogTest = {
  /** `<file>:<line>`, also the exact selector Playwright's CLI accepts to run just this test. */
  id: string;
  file: string;
  line: number;
  describeTitle: string;
  title: string;
};

type PlaywrightListSpec = {
  file: string;
  title: string;
  line: number;
};

type PlaywrightListSuite = {
  title: string;
  file: string;
  specs?: PlaywrightListSpec[];
  suites?: PlaywrightListSuite[];
};

function flattenSuite(suite: PlaywrightListSuite, describeTitle: string, out: CatalogTest[]) {
  for (const spec of suite.specs ?? []) {
    out.push({
      id: `${spec.file}:${spec.line}`,
      file: spec.file,
      line: spec.line,
      describeTitle,
      title: spec.title,
    });
  }

  for (const child of suite.suites ?? []) {
    flattenSuite(child, child.title, out);
  }
}

export async function listAvailableTests(): Promise<CatalogTest[]> {
  const { stdout } = await execFileAsync(PLAYWRIGHT_BIN, ["test", "--list", "--reporter=json"], {
    cwd: process.cwd(),
    maxBuffer: 1024 * 1024 * 20,
  });

  const report = JSON.parse(stdout) as { suites?: PlaywrightListSuite[] };
  const tests: CatalogTest[] = [];
  for (const suite of report.suites ?? []) {
    flattenSuite(suite, suite.title, tests);
  }

  return tests.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
}

export function toPlaywrightSelector(testId: string): string {
  return `${TEST_DIR}/${testId}`;
}
