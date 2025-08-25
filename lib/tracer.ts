import { trace, context as otelContext } from "@opentelemetry/api";
import { Effect, Tracer, Option, Layer, pipe } from "effect";

export const makeTracer: Effect.Effect<Tracer.Tracer, never, never> =
  Effect.gen(function* () {
    const currentTracer = yield* Effect.tracer;
    return Tracer.make({
      span(name, parent, context, links, startTime, kind) {
        const active = trace.getSpan(otelContext.active());
        const otelParent = active ? active.spanContext() : undefined;

        const externalParent = otelParent
          ? Option.some(
              Tracer.externalSpan({
                spanId: otelParent.spanId,
                traceId: otelParent.traceId,
                sampled: (otelParent.traceFlags & 1) === 1,
                context,
              })
            )
          : Option.none();

        const effectiveParent =
          parent._tag === "Some" ? parent : externalParent;

        const span = currentTracer.span(
          name,
          effectiveParent,
          context,
          links,
          startTime,
          kind
        );
        return span;
      },
      context: currentTracer.context,
    });
  });

export const layerTracer: Layer.Layer<never, never, never> = pipe(
  makeTracer,
  Effect.map(Layer.setTracer),
  Layer.unwrapEffect
);
