import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createProject, getAllProjects } from "@/lib/kv";
import { projectInputSchema } from "@/lib/types";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await getAllProjects();
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json(
      { error: "Не вдалося отримати список проєктів" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const project = await createProject({
      ...parsed.data,
      pdfUrl: parsed.data.pdfUrl || undefined,
      externalReportUrl: parsed.data.externalReportUrl || undefined,
    });
    revalidatePath("/");
    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Не вдалося створити проєкт" },
      { status: 500 }
    );
  }
}
