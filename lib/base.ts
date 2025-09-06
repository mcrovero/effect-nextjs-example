import { Tracer as OtelTracer, Resource } from "@effect/opentelemetry";
import { Next, NextAction } from "@mcrovero/effect-nextjs";
import {
  ProvideUserMiddleware,
  ProvideUserMiddlewareLive,
} from "./auth-middleware";
import { TodoStoreLive } from "./todo-store";

import { Layer, Logger, LogLevel } from "effect";
import {
  LogRequestMiddleware,
  LogRequestMiddlewareLive,
} from "./route-middleware";
import { layerTracer } from "./tracer";

const tracerWithOtel = layerTracer.pipe(
  Layer.provide(
    OtelTracer.layerGlobal.pipe(
      Layer.provide(Resource.layer({ serviceName: "next-app2" }))
    )
  )
);
const allLayers = Layer.mergeAll(
  ProvideUserMiddlewareLive,
  TodoStoreLive,
  LogRequestMiddlewareLive
);
const allLayersWithTracer = allLayers.pipe(
  Layer.provideMerge(tracerWithOtel),
  Layer.provide(Logger.minimumLogLevel(LogLevel.Debug))
);

export const BasePage = Next.make("base", allLayersWithTracer).middleware(
  ProvideUserMiddleware
);

export const BaseLayout = Next.make("base", allLayersWithTracer).middleware(
  ProvideUserMiddleware
);

export const BaseAction = NextAction.make(
  "base",
  allLayersWithTracer
).middleware(ProvideUserMiddleware);

export const BaseComponent = Next.make("base", allLayersWithTracer).middleware(
  ProvideUserMiddleware
);

export const BaseApi = Next.make("base", allLayersWithTracer)
  .middleware(LogRequestMiddleware)
  .middleware(ProvideUserMiddleware);
