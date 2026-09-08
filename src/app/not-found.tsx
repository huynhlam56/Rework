import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center"
      data-testid="not-found"
    >
      <p className="text-sm font-semibold text-neutral-500">404</p>
      <h1 className="text-2xl font-semibold text-neutral-900">We couldn&apos;t find that page</h1>
      <p className="max-w-sm text-sm text-neutral-500">
        The listing or page you&apos;re looking for may have been removed or never existed.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
      >
        Back to browsing
      </Link>
    </div>
  );
}
