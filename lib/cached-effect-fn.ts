import { Effect } from "effect";
import { cache } from "react";

const runEffectFn = <A, E, R, Args extends unknown[]>(
  effect: (...args: Args) => Effect.Effect<A, E, R>,
  ...args: Args
) => {
  return Effect.runPromise(effect(...args));
};

const runEffectCachedFn = cache(runEffectFn);

export const cachedEffectFn = <A, E, R, Args extends unknown[]>(
  effect: (...args: Args) => Effect.Effect<A, E, R>
) => {
  return (...args: Args) =>
    Effect.gen(function* () {
      const value = yield* Effect.promise(() => {
        return runEffectCachedFn(effect, ...args);
      });
      return value as A;
    });
};
