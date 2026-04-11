import { NextResponse, type NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { isAuthenticated } from "@/lib/auth";

const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Файл не надано" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Файл має бути у форматі PDF" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Розмір файлу не має перевищувати 10 МБ" },
        { status: 400 }
      );
    }

    const filename = `reports/${crypto.randomUUID()}-${file.name}`;
    const blob = await put(filename, file, {
      access: "public",
      contentType: "application/pdf",
    });

    return NextResponse.json({ url: blob.url });
  } catch {
    return NextResponse.json(
      { error: "Не вдалося завантажити файл" },
      { status: 500 }
    );
  }
}
