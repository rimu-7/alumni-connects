import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"), // Adjust this based on your needs
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export async function middleware(request) {
  // 1. Get IP (Works better on Vercel)
  const ip =
    request.ip ?? request.headers.get("x-forwarded-for") ?? "127.0.0.1";

  // 2. Limit Check
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  // 3. Return Error if limit exceeded
  if (!success) {
    return new NextResponse(
      JSON.stringify({
        error: "Too Many Requests",
        message: "Please slow down.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      }
    );
  }

  // 4. Proceed
  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", limit.toString());
  response.headers.set("X-RateLimit-Remaining", remaining.toString());
  response.headers.set("X-RateLimit-Reset", reset.toString());

  return response;
}

// ⚠️ IMPORTANT: Only run on API routes to save money and improve UX
export const config = {
  matcher: "/api/:path*",
};
