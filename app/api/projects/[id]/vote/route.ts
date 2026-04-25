import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { addVote } from "@/lib/kv";

export const dynamic = "force-dynamic";

interface Ctx {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: Ctx) {
  try {
    const body = await req.json();
    const value = Number(body.value);
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      return NextResponse.json(
        { error: "Оцінка має бути від 1 до 5" },
        { status: 400 }
      );
    }

    const project = await addVote(params.id, value);
    if (!project) {
      return NextResponse.json(
        { error: "Проєкт не знайдено" },
        { status: 404 }
      );
    }

    revalidatePath(`/projects/${params.id}`);
    revalidatePath("/");

    return NextResponse.json({
      sum: project.ratingSum,
      count: project.ratingCount,
    });
  } catch {
    return NextResponse.json(
      { error: "Помилка при голосуванні" },
      { status: 500 }
    );
  }
}
