import { CurrentUser } from "@/lib/auth-middleware";
import { BaseComponent } from "@/lib/base";
import { Effect } from "effect";

export const ServerComponent = BaseComponent.build(
  Effect.fn(function* ({ test }: { test: string }) {
    const user = yield* CurrentUser;
    return (
      <div>
        Server Component {user.name} {test}
      </div>
    );
  })
);
