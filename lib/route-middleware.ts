import { NextMiddleware } from "@mcrovero/effect-nextjs";
import { Schema } from "effect";

export class LogRequestMiddleware extends NextMiddleware.Tag<LogRequestMiddleware>()(
  "LogRequest",
  { failure: Schema.String, wrap: true }
) {}

export const LogRequestMiddlewareLive = NextMiddleware.layer(
  LogRequestMiddleware,
  ({ props, next }) => {
    console.log(props);
    return next;
  }
);
