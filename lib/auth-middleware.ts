import { NextMiddleware } from "@mcrovero/effect-nextjs";
import { reactCache } from "@mcrovero/effect-react-cache";
import { Layer, Schema } from "effect";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";

export class CurrentUser extends Context.Tag("CurrentUser")<
  CurrentUser,
  { id: string; name: string }
>() {}

export class ProvideUserMiddleware extends NextMiddleware.Tag<ProvideUserMiddleware>()(
  "ProvideUser",
  { provides: CurrentUser, failure: Schema.String }
) {}

/**
 * The getUser function is a function that gets the user from the database.
 * It is cached using the reactCache function and will be called only once in the request (Page/Layout)
 */
const getUser = Effect.gen(function* () {
  yield* Effect.log("Getting user");
  yield* Effect.sleep(2000);
  return { id: "u-1", name: "Alice" };
});

const cachedGetUser = reactCache(() => getUser);

export const ProvideUserMiddlewareLive = Layer.succeed(
  ProvideUserMiddleware,
  ProvideUserMiddleware.of(() => cachedGetUser())
);
