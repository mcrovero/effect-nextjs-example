import { BaseApi } from "@/lib/base";
import { Effect } from "effect";
import { NextResponse } from "next/server";

export const GET = BaseApi.build(
  Effect.fn(function* () {
    return NextResponse.json({ message: "Hello, world!" });
  })
);
