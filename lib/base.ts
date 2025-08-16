import { Next } from "@mcrovero/effect-nextjs";
import { Schema } from "effect";
import {
  ProvideUserMiddlewareLive,
  ProvideUserMiddleware,
} from "./auth-middleware";

const NextBase = Next.make(ProvideUserMiddlewareLive);

export const BasePage = NextBase.page("Home")
  .setParamsSchema(Schema.Struct({ id: Schema.String }))
  .middleware(ProvideUserMiddleware);

export const BaseLayout = NextBase.layout("BaseLayout").middleware(
  ProvideUserMiddleware
);

export const BaseAction = NextBase.action("BaseAction").middleware(
  ProvideUserMiddleware
);
