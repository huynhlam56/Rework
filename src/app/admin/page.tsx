import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listTestRuns } from "@/lib/services/test-runs";
import { listAvailableTests } from "@/lib/services/test-catalog";
import { triggerTestRunAction } from "@/app/actions/admin";
import { StatusBadge } from "@/components/status-badge";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const [runs, tests, { error }] = await Promise.all([listTestRuns(), listAvailableTests(), searchParams]);

  const testsByFile = new Map<string, typeof tests>();
  for (const test of tests) {
    const group = testsByFile.get(test.file) ?? [];
    group.push(test);
    testsByFile.set(test.file, group);
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">qahuynh test dashboard</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Select which Playwright tests to run against this app, then watch results land below.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Run tests</h2>

        {error ? (
          <div
            role="alert"
            data-testid="form-error"
            className="rounded-lg border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-300"
          >
            {error}
          </div>
        ) : null}

        {tests.length === 0 ? (
          <p className="text-sm text-neutral-500">No tests found under tests/e2e.</p>
        ) : (
          <form action={triggerTestRunAction} className="space-y-4" data-testid="run-tests-form">
            <div className="divide-y divide-neutral-800 rounded-xl border border-neutral-800">
              {Array.from(testsByFile.entries()).map(([file, fileTests]) => (
                <div key={file} className="p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">{file}</p>
                  <ul className="space-y-2">
                    {fileTests.map((test) => (
                      <li key={test.id}>
                        <label className="flex items-center gap-2 text-sm text-neutral-200">
                          <input
                            type="checkbox"
                            name="tests"
                            value={test.id}
                            defaultChecked
                            className="h-4 w-4 rounded border-neutral-600 bg-neutral-900 text-fuchsia-400 focus:ring-fuchsia-400"
                            data-testid="test-checkbox"
                          />
                          <span className="text-neutral-500">{test.describeTitle} ›</span> {test.title}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-200"
              data-testid="run-tests-button"
            >
              Run selected
            </button>
          </form>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Recent runs</h2>

        {runs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-800 px-6 py-16 text-center">
            <p className="text-sm text-neutral-400">No test runs yet. Select tests above and run them.</p>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-800 rounded-xl border border-neutral-800" data-testid="run-list">
            {runs.map((run) => {
              const passed = run.results.filter((r) => r.status === "PASSED").length;
              const failed = run.results.filter((r) => r.status === "FAILED").length;
              const total = run.results.length;

              return (
                <li key={run.id}>
                  <Link
                    href={`/admin/runs/${run.id}`}
                    className="flex items-center justify-between gap-4 p-4 hover:bg-neutral-900"
                    data-testid="run-row"
                  >
                    <div className="flex items-center gap-3">
                      <StatusBadge status={run.status} />
                      <div>
                        <p className="text-sm font-medium text-white">Run {run.id.slice(0, 8)}</p>
                        <p className="text-sm text-neutral-500">
                          {run.createdAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-400">
                      {total > 0 ? `${passed}/${total} passed${failed > 0 ? `, ${failed} failed` : ""}` : "—"}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
