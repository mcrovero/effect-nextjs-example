import { BasePage, CurrentUser } from "@/lib/base";
import { Effect } from "effect";
import { cachedFunction2, cachedFunction3 } from "./cached";
import { ClientComponent } from "./client-component";

export default BasePage.build(({ searchParams }) =>
  Effect.gen(function* () {
    const user = yield* CurrentUser;
    const resolvedSearchParams = yield* searchParams;

    const value = yield* Effect.all([cachedFunction2()], {
      concurrency: 2,
    });

    return (
      <div>
        Hello {user.name} {resolvedSearchParams.id ?? "no id"}
        <br />
        {value[0].name}
        <br />
        <ClientComponent />
      </div>
    );
  })
);
