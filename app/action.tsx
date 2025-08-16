"use server";

import { BaseAction, CurrentUser } from "@/lib/base";
import { Effect } from "effect";

export const testAction = BaseAction.build(async () =>
  Effect.gen(function* () {
    const user = yield* CurrentUser;
    return { user: user.name };
  })
);
