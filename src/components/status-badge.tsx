const STATUS_STYLES: Record<string, string> = {
  QUEUED: "bg-neutral-800 text-neutral-300",
  RUNNING: "bg-blue-950 text-blue-300",
  PASSED: "bg-green-950 text-green-300",
  FAILED: "bg-red-950 text-red-300",
  SKIPPED: "bg-neutral-800 text-neutral-400",
  ERRORED: "bg-amber-950 text-amber-300",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      data-testid="status-badge"
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? "bg-neutral-800 text-neutral-300"}`}
    >
      {status}
    </span>
  );
}
