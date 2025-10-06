import { Next } from "@mcrovero/effect-nextjs";
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

const allLayers = Layer.mergeAll(
  ProvideUserMiddlewareLive,
  TodoStoreLive,
  LogRequestMiddlewareLive
);
const allLayersWithTracer = allLayers.pipe(
  Layer.provideMerge(layerTracer),
  Layer.provide(Logger.minimumLogLevel(LogLevel.Debug))
);

export const BasePage = Next.make("base", allLayersWithTracer).middleware(
  ProvideUserMiddleware
);

export const BaseLayout = Next.make("base", allLayersWithTracer).middleware(
  ProvideUserMiddleware
);

export const BaseAction = Next.make("base", allLayersWithTracer).middleware(
  ProvideUserMiddleware
);

export const BaseComponent = Next.make("base", allLayersWithTracer).middleware(
  ProvideUserMiddleware
);

export const BaseApi = Next.make("base", allLayersWithTracer)
  .middleware(LogRequestMiddleware)
  .middleware(ProvideUserMiddleware);
