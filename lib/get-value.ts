import { Effect } from "effect";
import { cachedEffect } from "./cached-effect";

export const getValue = Effect.gen(function* () {
  yield* Effect.log("getValue");
  yield* Effect.sleep(1000);
  return "value";
});

export const getValueCached = cachedEffect(getValue);
