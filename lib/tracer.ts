import { Tracer as OtelTracer, Resource } from "@effect/opentelemetry";
import { Effect, Layer, Option } from "effect";

export const layerTracer = OtelTracer.layerGlobal.pipe(
  Layer.provide(
    Layer.unwrapEffect(
      Effect.gen(function* () {
        const resource = yield* Effect.serviceOption(Resource.Resource);
        if (Option.isSome(resource)) {
          return Layer.succeed(Resource.Resource, resource.value);
        }
        return Resource.layerFromEnv();
      })
    )
  )
);
