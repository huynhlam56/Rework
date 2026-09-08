import { adminLoginAction } from "@/app/actions/admin";
import { QahuynhLogo } from "@/components/qahuynh-logo";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm">
      <QahuynhLogo size={40} className="mb-4" />
      <h1 className="text-2xl font-semibold">Sign in to qahuynh</h1>
      <p className="mt-1 text-sm text-neutral-400">Test metrics dashboard access only.</p>

      <form action={adminLoginAction} className="mt-6 space-y-4" data-testid="admin-login-form">
        {error ? (
          <div role="alert" data-testid="form-error" className="rounded-lg border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-200"
          data-testid="admin-login-submit"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
