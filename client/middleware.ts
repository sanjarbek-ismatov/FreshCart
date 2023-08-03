import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-url", req.url);
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
