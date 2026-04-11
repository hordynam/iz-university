import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CatalogView } from "@/components/CatalogView";
import { getAllProjects } from "@/lib/kv";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let projects: Project[] = [];
  let loadError: string | null = null;

  try {
    projects = await getAllProjects();
  } catch {
    loadError =
      "Сервіс зберігання наразі недоступний. Будь ласка, спробуйте пізніше.";
  }

  return (
    <>
      <Header />
      <main className="container py-8 flex-1">
        {loadError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center">
            <p className="text-destructive font-medium">{loadError}</p>
          </div>
        ) : (
          <CatalogView projects={projects} />
        )}
      </main>
      <Footer />
    </>
  );
}
