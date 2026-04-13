import { NextResponse, type NextRequest } from "next/server";
import { head } from "@vercel/blob";

export async function GET(req: NextRequest) {
  const blobUrl = req.nextUrl.searchParams.get("url");

  if (!blobUrl) {
    return NextResponse.json({ error: "url обов'язковий" }, { status: 400 });
  }

  try {
    const blob = await head(blobUrl);

    const fileRes = await fetch(blobUrl, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!fileRes.ok) {
      return NextResponse.json(
        { error: "Не вдалося отримати файл" },
        { status: fileRes.status }
      );
    }

    return new Response(fileRes.body, {
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
