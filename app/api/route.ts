import { BaseApi } from "@/lib/base";
import { Effect } from "effect";
import { NextResponse } from "next/server";

const _GET = Effect.fn(function* () {
  return NextResponse.json({ message: "Hello, world!" });
});
export const GET = BaseApi.build(_GET);
