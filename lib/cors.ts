import { NextResponse } from "next/server";

const DEFAULT_WEB_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

function getConfiguredWebOrigins(): string[] {
  const origins = [...DEFAULT_WEB_ORIGINS];

  if (process.env.NEXT_PUBLIC_APP_URL) {
    origins.push(process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, ""));
  }

  if (process.env.VERCEL_URL) {
    origins.push(`https://${process.env.VERCEL_URL}`);
  }

  return origins;
}

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) {
    return true;
  }

  if (origin.startsWith("chrome-extension://")) {
    return true;
  }

  return getConfiguredWebOrigins().includes(origin);
}

function corsHeaders(origin: string | null): HeadersInit {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };

  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

export function applyCorsHeaders(
  response: NextResponse,
  request: Request
): NextResponse {
  const origin = request.headers.get("Origin");

  if (!origin) {
    return response;
  }

  if (!isAllowedOrigin(origin)) {
    return response;
  }

  for (const [key, value] of Object.entries(corsHeaders(origin))) {
    response.headers.set(key, value);
  }

  return response;
}

export function jsonWithCors(
  request: Request,
  body: unknown,
  init?: ResponseInit
): NextResponse {
  return applyCorsHeaders(NextResponse.json(body, init), request);
}

export function handleCorsPreflight(request: Request): NextResponse {
  const origin = request.headers.get("Origin");

  if (origin && !isAllowedOrigin(origin)) {
    return new NextResponse(null, { status: 403 });
  }

  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}
