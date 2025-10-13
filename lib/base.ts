import { Next } from "@mcrovero/effect-nextjs";
import {
  ProvideUserMiddleware,
  ProvideUserMiddlewareLive,
} from "./auth-middleware";

import { NodeContext } from "@effect/platform-node";
import { Layer, Logger, LogLevel } from "effect";
import {
  LogRequestMiddleware,
  LogRequestMiddlewareLive,
} from "./route-middleware";
import { TodoStore } from "./services/todo-store";
import { StatefulContext } from "./stateful-runtime";
import { layerTracer } from "./tracer";

const allLayers = Layer.mergeAll(
  ProvideUserMiddlewareLive,
  TodoStore.Default.pipe(Layer.provide(NodeContext.layer)),
  LogRequestMiddlewareLive,
  Layer.effectContext(StatefulContext)
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
