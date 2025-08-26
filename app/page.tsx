import { CurrentUser } from "@/lib/auth-middleware";
import { BasePage } from "@/lib/base";
import { TodoStore } from "@/lib/todo-store";
import { Effect } from "effect";
import { ClientComponent } from "./client-component";

export default BasePage.build(() =>
  Effect.gen(function* () {
    const user = yield* CurrentUser;

    return yield* TodoStore.pipe(
      Effect.flatMap((s) => s.readTodos),
      Effect.map((todos) => {
        return (
          <div className="space-y-6">
            <section className="space-y-1">
              <h2 className="text-xl font-semibold">Todos</h2>
              <p className="text-sm text-neutral-500">
                Simple file-backed Todo app.
              </p>
            </section>

            <div className="rounded-xl border p-5 bg-white/70 dark:bg-neutral-900/40">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Current User</h3>
                  <p className="text-sm text-neutral-500">
                    Provided via middleware
                  </p>
                </div>
                <div className="text-sm rounded-md border px-2 py-1">
                  {user.name}
                </div>
              </div>
            </div>

            <div className="rounded-xl border p-5 bg-white/70 dark:bg-neutral-900/40">
              <ClientComponent initial={todos} />
            </div>
          </div>
        );
      }),
      Effect.catchAll((err) =>
        Effect.succeed(
          <div className="space-y-4">
            <div className="rounded-xl border p-5 bg-white/70 dark:bg-neutral-900/40">
              <div className="text-sm text-red-600">{String((err as any)?.message ?? "Error fetching todos")}</div>
            </div>
          </div>
        )
      )
    );
  })
);
