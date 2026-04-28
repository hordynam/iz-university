"use client";

import { useCallback, useMemo, useState } from "react";
import { FilterBar, EMPTY_FILTERS, type FilterState } from "./FilterBar";
import { ProjectCard } from "./ProjectCard";
import { FolderOpen, Star } from "lucide-react";
import type { Project } from "@/lib/types";

interface CatalogViewProps {
  projects: Project[];
}

export function CatalogView({ projects }: CatalogViewProps) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  const faculties = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.faculty))).sort();
  }, [projects]);

  const academicYears = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.academicYear))).sort(
      (a, b) => b.localeCompare(a)
    );
  }, [projects]);

  const handleChange = useCallback((f: FilterState) => setFilters(f), []);

  const pinnedProjects = useMemo(
    () => projects.filter((p) => p.pinned),
    [projects]
  );

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (filters.faculty !== "all" && p.faculty !== filters.faculty)
        return false;
      if (
        filters.educationLevel !== "all" &&
        p.educationLevel !== filters.educationLevel
      )
        return false;
      if (filters.year !== "all" && String(p.year) !== filters.year)
        return false;
      if (
        filters.academicYear !== "all" &&
        p.academicYear !== filters.academicYear
      )
        return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const hay =
          `${p.studentName} ${p.companyName} ${p.projectTitle} ${p.description}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [projects, filters]);

  return (
    <div className="space-y-6">
      {pinnedProjects.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-brand-gold text-brand-gold" />
            <h2 className="text-lg font-semibold text-brand-navy">Кращі проєкти</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pinnedProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
          <div className="border-t border-border" />
        </section>
      )}

      <FilterBar
        faculties={faculties}
        academicYears={academicYears}
        onChange={handleChange}
      />

      {projects.length === 0 ? (
        <EmptyState
          title="Проєктів поки немає"
          description="Зверніться до адміністратора для додавання проєктів."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Немає результатів"
          description="Жоден проєкт не відповідає обраним фільтрам."
        />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Знайдено проєктів: <strong>{filtered.length}</strong>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-24 w-24 rounded-full bg-surface flex items-center justify-center mb-4">
        <FolderOpen className="h-12 w-12 text-brand-navy/40" />
      </div>
      <h3 className="text-xl font-semibold text-brand-navy mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md">{description}</p>
    </div>
  );
}
