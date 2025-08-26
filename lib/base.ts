import { Tracer as OtelTracer, Resource } from "@effect/opentelemetry";
import { Next } from "@mcrovero/effect-nextjs";
import { ProvideUserMiddleware, ProvideUserMiddlewareLive } from "./auth-middleware";
import { TodoStoreLive } from "./todo-store";

import { Layer, Schema } from "effect";
import { layerTracer } from "./tracer";

const tracerWithOtel = layerTracer.pipe(
  Layer.provide(
    OtelTracer.layerGlobal.pipe(
      Layer.provide(Resource.layer({ serviceName: "next-app" }))
    )
  )
);

const allLayers = Layer.mergeAll(ProvideUserMiddlewareLive, TodoStoreLive);
const allLayersWithTracer = Layer.mergeAll(allLayers, tracerWithOtel);

const NextBase = Next.make(allLayersWithTracer);

export const BasePage = NextBase.page("BasePage")
  .setParamsSchema(Schema.Struct({ id: Schema.String }))
  .middleware(ProvideUserMiddleware);

export const BaseLayout = NextBase.layout("BaseLayout").middleware(
  ProvideUserMiddleware
);

export const BaseAction = NextBase.action("BaseAction").middleware(
  ProvideUserMiddleware
);
