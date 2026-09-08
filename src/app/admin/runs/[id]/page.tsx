import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getTestRunById } from "@/lib/services/test-runs";
import { StatusBadge } from "@/components/status-badge";

export default async function TestRunDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const run = await getTestRunById(id);

  if (!run) {
    notFound();
  }

  return (
    <div className="space-y-6" data-testid="run-detail">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Run {run.id.slice(0, 8)}</h1>
          <StatusBadge status={run.status} />
        </div>
        <p className="mt-1 text-sm text-neutral-400">
          {run.createdAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
          {run.startedAt && run.finishedAt
            ? ` · ${((run.finishedAt.getTime() - run.startedAt.getTime()) / 1000).toFixed(1)}s`
            : null}
        </p>
      </div>

      {run.errorMessage ? (
        <pre className="overflow-x-auto rounded-lg border border-amber-900 bg-amber-950/50 p-4 text-xs text-amber-200">
          {run.errorMessage}
        </pre>
      ) : null}

      {run.results.length === 0 ? (
        <p className="text-sm text-neutral-500">No test results recorded for this run.</p>
      ) : (
        <ul className="divide-y divide-neutral-800 rounded-xl border border-neutral-800" data-testid="result-list">
          {run.results.map((result) => (
            <li key={result.id} className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{result.testTitle}</p>
                  <p className="text-sm text-neutral-500">
                    {result.testFile} · {result.durationMs}ms
                  </p>
                </div>
                <StatusBadge status={result.status} />
              </div>
              {result.errorMessage ? (
                <pre className="mt-3 overflow-x-auto rounded-lg border border-red-900 bg-red-950/50 p-3 text-xs text-red-200">
                  {result.errorMessage}
                </pre>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
