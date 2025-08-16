import { Effect } from "effect";
import { cache } from "react";

const runEffect = <T>(effect: Effect.Effect<T>) => {
  return Effect.runPromise(effect);
};

const runEffectCached = cache(runEffect);

export const cachedEffect = <T>(effect: Effect.Effect<T>) => {
  return Effect.gen(function* () {
    const value = yield* Effect.promise(() => {
      return runEffectCached(effect);
    });
    return value;
  });
};
