import { CurrentUser } from "@/lib/auth-middleware";
import { BaseComponent } from "@/lib/base";
import { Effect } from "effect";

export const _ServerComponent = Effect.fn(function* ({
  test,
}: {
  test: string;
}) {
  const user = yield* CurrentUser;
  return (
    <div>
      Server Component {user.name} {test}
    </div>
  );
});
export const ServerComponent = BaseComponent.build(_ServerComponent);
