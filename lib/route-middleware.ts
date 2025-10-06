import { NextMiddleware } from "@mcrovero/effect-nextjs";
import { Layer, Schema } from "effect";

export class LogRequestMiddleware extends NextMiddleware.Tag<LogRequestMiddleware>()(
  "LogRequest",
  { failure: Schema.String, wrap: true }
) {}

export const LogRequestMiddlewareLive = Layer.succeed(
  LogRequestMiddleware,
  LogRequestMiddleware.of(({ props, next }) => {
    console.log(props);
    return next;
  })
);
