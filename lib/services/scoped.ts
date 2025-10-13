import { Context, Effect, Layer } from "effect";

export class Random extends Context.Tag("MyRandomService")<
  Random,
  { readonly next: Effect.Effect<number> }
>() {}

// Scoped layer to test next HMR disposal
const scopedEffect = Effect.gen(function* () {
  yield* Effect.log("Starting scoped effect");

  // This is called at application shutdown
  yield* Effect.addFinalizer(() => Effect.log(`Finalizer`));
  return {
    next: Effect.gen(function* () {
      return Math.random();
    }),
  };
});

export const RandomScopedLayer = Layer.scoped(Random, scopedEffect);
