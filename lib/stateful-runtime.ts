import { Effect, ManagedRuntime } from "effect";
import { globalValue } from "effect/GlobalValue";
import { RandomScopedLayer } from "./services/scoped";

export const statefulRuntime = globalValue("statefulRuntime", () => {
  const managedRuntime = ManagedRuntime.make(RandomScopedLayer);
  process.on("SIGINT", () => {
    managedRuntime.dispose();
  });
  process.on("SIGTERM", () => {
    managedRuntime.dispose();
  });
  return managedRuntime;
});

export const StatefulContext = statefulRuntime.runtimeEffect.pipe(
  Effect.map((runtime) => runtime.context)
);
