import { CurrentUser } from "@/lib/auth-middleware";
import { BasePage } from "@/lib/base";
import { TodoStore } from "@/lib/todo-store";
import { decodeSearchParamsUnknown } from "@/lib/utils/params";
import { Effect, Schema } from "effect";
import { ClientComponent } from "./client-component";
import { ServerComponent } from "./server-component";

const HomePage = Effect.fn("HomePage")((props: PageProps<"/">) =>
  Effect.all([
    CurrentUser,
    decodeSearchParamsUnknown(
      Schema.Struct({ search: Schema.optional(Schema.String) })
    )(props.searchParams),
  ]).pipe(
    Effect.flatMap(([user, searchParams]) =>
      TodoStore.pipe(
        Effect.flatMap((s) => s.searchTodos(searchParams.search)),
        Effect.map((todos) => [user, todos] as const)
      )
    ),
    Effect.map(([user, todos]) => {
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

          <ServerComponent test="test" />
        </div>
      );
    }),
    Effect.catchAll((err) =>
      Effect.succeed(
        <div className="space-y-4">
          <div className="rounded-xl border p-5 bg-white/70 dark:bg-neutral-900/40">
            <div className="text-sm text-red-600">
              {String((err as any)?.message ?? "Error fetching todos")}
            </div>
          </div>
        </div>
      )
    )
  )
);

export default BasePage.build(HomePage);
