import { NextResponse } from "next/server";

const OPENF1_BASE = "https://api.openf1.org/v1";
const ALLOWED_ENDPOINTS = new Set(["sessions", "drivers", "laps"]);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const path = url.searchParams.get("path");

  if (!path || !ALLOWED_ENDPOINTS.has(path)) {
    return NextResponse.json(
      { error: "Invalid OpenF1 endpoint" }, 
      { status: 400 }
    );
  }

  const queryParams = new URLSearchParams(url.searchParams);
  queryParams.delete("path");

  const externalUrl = `${OPENF1_BASE}/${path}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const externalRes = await fetch(externalUrl);

  const contentType = externalRes.headers.get("content-type") ?? "application/json";
  const body = await externalRes.text();

  return new NextResponse(body, {
    status: externalRes.status,
    headers: { "content-type": contentType },
  });
}
