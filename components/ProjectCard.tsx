import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingBadge } from "@/components/RatingBadge";
import { ArrowRight, Building2 } from "lucide-react";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden border-border hover:border-brand-navy transition-all">
      <div className="h-1 bg-gradient-to-r from-brand-navy to-brand-gold" />
      <CardHeader className="pb-4">
        <div className="flex items-start gap-2 text-brand-navy mb-2">
          <Building2 className="h-5 w-5 shrink-0 mt-1" />
          <h3 className="text-xl font-bold leading-tight">
            {project.companyName}
          </h3>
        </div>
        <p className="text-sm font-medium text-foreground line-clamp-2">
          {project.projectTitle}
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="text-sm text-muted-foreground border-t border-border pt-3">
          <p className="font-medium text-foreground">{project.studentName}</p>
          <p className="text-xs mt-0.5">{project.faculty}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge variant="default">{project.educationLevel}</Badge>
          <Badge variant="outline">{project.year} курс</Badge>
          <Badge variant="secondary">{project.group}</Badge>
        </div>

        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
          <RatingBadge rating={project.rating} size="sm" />
          <Link href={`/projects/${project.id}`}>
            <Button size="sm" variant="default">
              Переглянути
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
