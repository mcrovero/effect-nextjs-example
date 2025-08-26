import { trace, context as otelContext } from "@opentelemetry/api";
import { Effect, Tracer, Option, Layer, Context } from "effect";
import { Tracer as OtelTracer, Resource } from "@effect/opentelemetry";

// !! This implementation still has limitations: follow: https://github.com/Effect-TS/effect/pull/5433

const childTracer = Layer.unwrapEffect(
  Effect.gen(function* () {
    const currentTracer = yield* Effect.tracer;
    return Layer.setTracer(
      Tracer.make({
        span(name, parent, context, links, startTime, kind) {
          const effectiveParent =
            parent._tag === "Some" ? parent : getOtelParent(context);

          return currentTracer.span(
            name,
            effectiveParent,
            context,
            links,
            startTime,
            kind
          );
        },
        context: currentTracer.context,
      })
    );
  })
);

const getOtelParent = (context: Context.Context<never>) => {
  const active = trace.getSpan(otelContext.active());
  const otelParent = active ? active.spanContext() : undefined;
  return otelParent
    ? Option.some(
      Tracer.externalSpan({
        spanId: otelParent.spanId,
        traceId: otelParent.traceId,
        sampled: (otelParent.traceFlags & 1) === 1,
        context,
      })
    )
    : Option.none();
}

export const layerTracer = childTracer.pipe(
  Layer.provide(OtelTracer.layerGlobal),
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