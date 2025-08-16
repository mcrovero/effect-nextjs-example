import { BasePage } from "@/lib/base";
import { CurrentUser } from "@/lib/auth-middleware";
import { Effect } from "effect";
import { ClientComponent } from "./client-component";

export default BasePage.build(({ searchParams }) =>
  Effect.gen(function* () {
    const user = yield* CurrentUser;
    const resolvedSearchParams = yield* searchParams;

    return (
      <div className="space-y-6">
        <section className="space-y-1">
          <h2 className="text-xl font-semibold">Home</h2>
          <p className="text-sm text-neutral-500">
            This page is built with Effect-powered middlewares and schemas.
          </p>
        </section>

        <div className="rounded-xl border p-5 bg-white/70 dark:bg-neutral-900/40">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Current User</h3>
              <p className="text-sm text-neutral-500">Provided via middleware</p>
            </div>
            <div className="text-sm rounded-md border px-2 py-1">{user.name}</div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-neutral-500">Search param `id`:</span>{" "}
            <span className="font-mono">{resolvedSearchParams.id ?? "(none)"}</span>
          </div>

          <form className="mt-4 flex items-center gap-2" method="get">
            <input
              type="text"
              name="id"
              placeholder="Set id search param"
              defaultValue={resolvedSearchParams.id ?? ""}
              className="flex-1 rounded-md border px-3 py-2 bg-transparent"
            />
            <button
              type="submit"
              className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Apply
            </button>
          </form>
        </div>

        <div className="rounded-xl border p-5 bg-white/70 dark:bg-neutral-900/40">
          <h3 className="font-medium">Client Action</h3>
          <p className="text-sm text-neutral-500">
            Trigger a server action from a client component.
          </p>
          <div className="mt-3">
            <ClientComponent />
          </div>
        </div>
      </div>
    );
  })
);
