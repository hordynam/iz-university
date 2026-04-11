import { NextResponse, type NextRequest } from "next/server";
import { del } from "@vercel/blob";
import {
  deleteProject,
  getProjectById,
  updateProject,
} from "@/lib/kv";
import { projectInputSchema } from "@/lib/types";
import { isAuthenticated } from "@/lib/auth";

interface Ctx {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const project = await getProjectById(params.id);
    if (!project) {
      return NextResponse.json(
        { error: "Проєкт не знайдено" },
        { status: 404 }
      );
    }
    return NextResponse.json(project);
  } catch {
    return NextResponse.json(
      { error: "Не вдалося отримати проєкт" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = projectInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Невалідні дані" },
        { status: 400 }
      );
    }

    const updated = await updateProject(params.id, {
      ...parsed.data,
      pdfUrl: parsed.data.pdfUrl || undefined,
      externalReportUrl: parsed.data.externalReportUrl || undefined,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Проєкт не знайдено" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Не вдалося оновити проєкт" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  try {
    const deleted = await deleteProject(params.id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Проєкт не знайдено" },
        { status: 404 }
      );
    }

    if (deleted.pdfUrl) {
      try {
        await del(deleted.pdfUrl);
      } catch {
        // Ignore blob deletion failures — the project record is already gone.
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Не вдалося видалити проєкт" },
      { status: 500 }
    );
  }
}
