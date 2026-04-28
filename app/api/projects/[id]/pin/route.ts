import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { pinProject } from "@/lib/kv";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface Ctx {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const pinned = Boolean(body.pinned);

    const updated = await pinProject(params.id, pinned);
    if (!updated) {
      return NextResponse.json({ error: "Проєкт не знайдено" }, { status: 404 });
    }

    revalidatePath("/");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Не вдалося змінити закріплення" }, { status: 500 });
  }
}
