import { CurrentUser } from "@/lib/base";
import { cachedEffect } from "@/lib/cached-effect";
import { cachedEffectFn } from "@/lib/cached-effect-fn";
import { Effect } from "effect";

const program = Effect.gen(function* () {
  yield* Effect.log(`Fetching user`);
  yield* Effect.sleep(2000);
  yield* Effect.log(`Fetched user`);
  return { id: "u-1", name: "Alice" };
});

const program2 = Effect.gen(function* () {
  yield* Effect.log(`Fetching user`);
  yield* Effect.sleep(2000);
  yield* Effect.log(`Fetched user`);
  return { id: "u-1", name: "Alice" };
});

export const cachedProgram = cachedEffect(program);
export const cachedProgram2 = cachedEffect(program2);

function cachableFunction(id: string) {
  return Effect.gen(function* () {
    yield* Effect.log(`Fetching user ${id}`);
    yield* Effect.sleep(2000);
    yield* Effect.log(`Fetched user ${id}`);
    return { id: "u-1", name: "Alice" };
  });
}

export const cachedFunction = cachedEffectFn(cachableFunction);

export const cachedFunction2 = cachedEffectFn(() =>
  Effect.gen(function* () {
    yield* Effect.log(`Fetching user FN2`);
    yield* Effect.sleep(2000);
    yield* Effect.log(`Fetched user FN2`);
    return { id: "u-1", name: "Alice" };
  })
);

export const cachedFunction3 = cachedEffectFn(() =>
  Effect.gen(function* () {
    yield* Effect.log(`Fetching user FN3`);
    yield* Effect.sleep(2000);
    yield* Effect.log(`Fetched user FN3`);
    return { id: "u-1", name: "Alice" };
  })
);

export const cachedFunctionWithDeps = cachedEffectFn(() =>
  Effect.gen(function* () {
    const user = yield* CurrentUser;
    return { id: user.id, name: user.name };
  })
);
