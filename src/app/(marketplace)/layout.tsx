import Link from "next/link";

export default function MarketplaceLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-4 sm:px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight text-neutral-900">
            Rewear
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>

      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-neutral-500 sm:px-6">
          Rewear is a demo app built to showcase full-stack and Playwright SDET skills. Not a real
          store.
        </div>
      </footer>
    </>
  );
}
