"use server";

import { BaseAction } from "@/lib/base";
import { CurrentUser } from "@/lib/auth-middleware";
import { Effect } from "effect";

export const testAction = BaseAction.build(async () =>
  Effect.gen(function* () {
    const user = yield* CurrentUser;
    return { user: user.name };
  })
);
