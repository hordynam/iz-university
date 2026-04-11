import { NextResponse, type NextRequest } from "next/server";
import { get } from "@vercel/blob";

export async function GET(req: NextRequest) {
  const blobUrl = req.nextUrl.searchParams.get("url");

  if (!blobUrl) {
    return NextResponse.json({ error: "url обов'язковий" }, { status: 400 });
  }

  try {
    const { stream, blob } = await get(blobUrl, { access: "private" });
    return new Response(stream, {
      headers: {
        "Content-Type": blob.contentType || "application/pdf",
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Не вдалося отримати файл" },
      { status: 500 }
    );
  }
}
