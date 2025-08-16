import { BaseLayout } from "@/lib/base";
import { CurrentUser } from "@/lib/auth-middleware";
import { Effect } from "effect";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Effect + Next.js Demo",
  description: "Typed pages, middleware, and caching with Effect in the Next.js App Router.",
};

export default BaseLayout.build(({ children }) =>
  Effect.gen(function* () {
    const user = yield* CurrentUser;
    return (
      <html lang="en">
        <body className="bg-background text-foreground antialiased">
          <div className="min-h-dvh flex flex-col">
            <header className="border-b">
              <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-semibold">Effect + Next.js</h1>
                  <p className="text-sm text-neutral-500">Typed pages, middleware, and cache</p>
                </div>
                <div className="text-sm rounded-full border px-3 py-1 bg-neutral-50/50 dark:bg-neutral-900/50">
                  {user.name}
                </div>
              </div>
            </header>
            <main className="mx-auto max-w-3xl px-6 py-8 grow">{children}</main>
            <footer className="border-t py-4 text-center text-xs text-neutral-500">
              Built with <code>@mcrovero/effect-nextjs</code> & <code>@mcrovero/effect-react-cache</code>
            </footer>
          </div>
        </body>
      </html>
    );
  })
);
