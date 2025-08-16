import { Layer, Schema } from "effect"
import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import { Next, NextMiddleware } from "@mcrovero/effect-nextjs"

export class CurrentUser extends Context.Tag("CurrentUser")<
  CurrentUser,
  { id: string; name: string }
>() {}

export class ProvideUser extends NextMiddleware.Tag<ProvideUser>()(
  "ProvideUser",
  { provides: CurrentUser, failure: Schema.String }
) {}

const ProvideUserLive = Layer.succeed(
  ProvideUser,
  ProvideUser.of(() => Effect.succeed({ id: "u-1", name: "Alice" }))
)

const NextBase = Next.make(ProvideUserLive)

export const BasePage = NextBase.page("Home")
  .setParamsSchema(Schema.Struct({ id: Schema.String }))
  .middleware(ProvideUser)

export const BaseLayout = NextBase.layout("BaseLayout").middleware(ProvideUser)

export const BaseAction = NextBase.action("BaseAction").middleware(ProvideUser)
