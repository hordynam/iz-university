import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectRating } from "@/components/ProjectRating";
import {
  ArrowLeft,
  ExternalLink,
  FileWarning,
  Building2,
  GraduationCap,
  Users,
} from "lucide-react";
import { getProjectById } from "@/lib/kv";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const project = await getProjectById(params.id);
    if (!project) return { title: "Проєкт не знайдено | ДТЕУ" };
    return {
      title: `${project.projectTitle} — ${project.companyName} | ДТЕУ`,
      description: project.description,
    };
  } catch {
    return { title: "ДТЕУ — Інтегрована звітність" };
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const project = await getProjectById(params.id).catch(() => null);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="container py-8 flex-1">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4" />
            Повернутись до бази проєктів
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <section className="bg-white border border-border rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 text-brand-navy mb-4">
                <GraduationCap className="h-5 w-5" />
                <h2 className="text-lg font-semibold">
                  Інформація про здобувача
                </h2>
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-y-2 text-sm">
                <Row label="ПІБ" value={project.studentName} />
                <Row
                  label="Освітньо-професійна програма"
                  value={project.educationalProgram}
                />
                <Row
                  label="Рівень освіти"
                  value={
                    <Badge variant="default">{project.educationLevel}</Badge>
                  }
                />
                <Row label="Факультет" value={project.faculty} />
                <Row label="Курс" value={`${project.year} курс`} />
                <Row label="Група" value={project.group} />
                <Row label="Навчальний рік" value={project.academicYear} />
              </dl>
            </section>

            <section className="bg-white border border-border rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 text-brand-navy mb-4">
                <Building2 className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Про проєкт</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Підприємство</p>
                  <p className="text-lg font-semibold text-brand-navy">
                    {project.companyName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Тема роботи</p>
                  <p className="font-medium">{project.projectTitle}</p>
                </div>
                {project.description && (
                  <div>
                    <p className="text-xs text-muted-foreground">Опис</p>
                    <p className="text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="bg-white border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-brand-navy mb-4">
                Рейтинг проєкту
              </h2>
              <ProjectRating
                projectId={project.id}
                initialSum={project.ratingSum ?? 0}
                initialCount={project.ratingCount ?? 0}
              />
            </section>

            <section className="bg-white border border-border rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 text-brand-navy mb-4">
                <Users className="h-5 w-5" />
                <h2 className="text-lg font-semibold">
                  Підприємства-аналоги
                </h2>
              </div>
              {project.analogCompanies.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Аналогічні підприємства не вказані.
                </p>
              ) : (
                <ul className="space-y-2">
                  {project.analogCompanies.map((a, i) => (
                    <li key={i}>
                      <a
                        href={a.reportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 rounded-md border border-border hover:border-brand-navy hover:bg-surface transition-colors group"
                      >
                        <Building2 className="h-4 w-4 text-brand-navy shrink-0" />
                        <span className="flex-1 font-medium">{a.name}</span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-brand-navy" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <h2 className="text-lg font-semibold text-brand-navy mb-3">
                Звіт
              </h2>
              <ReportViewer
                pdfUrl={project.pdfUrl}
                externalReportUrl={project.externalReportUrl}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </>
  );
}

function getEffectivePdfUrl(pdfUrl: string): string {
  if (pdfUrl.includes(".private.blob.vercel-storage.com")) {
    return `/api/blob-url?url=${encodeURIComponent(pdfUrl)}`;
  }
  return pdfUrl;
}

function ReportViewer({
  pdfUrl,
  externalReportUrl,
}: {
  pdfUrl?: string;
  externalReportUrl?: string;
}) {
  if (pdfUrl) {
    const effectiveUrl = getEffectivePdfUrl(pdfUrl);
    return (
      <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">
        <iframe
          src={effectiveUrl}
          className="w-full h-[600px] border-0"
          title="PDF звіт"
        />
        <div className="p-3 border-t border-border bg-surface">
          <a
            href={effectiveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-navy hover:underline inline-flex items-center gap-1"
          >
            Відкрити у новій вкладці
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    );
  }

  if (externalReportUrl) {
    return (
      <div className="bg-white border border-border rounded-lg p-6 shadow-sm text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Звіт доступний за зовнішнім посиланням
        </p>
        <a
          href={externalReportUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="gold" size="lg" className="w-full">
            Відкрити звіт
            <ExternalLink className="h-4 w-4" />
          </Button>
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-lg p-6 shadow-sm text-center">
      <FileWarning className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">
        Звіт поки недоступний для перегляду.
      </p>
    </div>
  );
}
