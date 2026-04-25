"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AdminForm } from "./AdminForm";
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Loader2,
  FolderOpen,
} from "lucide-react";
import type { Project } from "@/lib/types";

export function AdminPanel() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<Project | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const load = async () => {
    setError(null);
    try {
      const res = await fetch("/api/projects", { cache: "no-store" });
      if (!res.ok) throw new Error("Не вдалося завантажити проєкти");
      const data = (await res.json()) as Project[];
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      const res = await fetch(`/api/projects/${deleting.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Не вдалося видалити проєкт");
      setDeleting(null);
      await load();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка");
    } finally {
      setDeletingBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">
            Адміністративна панель
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Керування базою проєктів інтегрованих звітів
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Додати проєкт
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Вийти
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
        {projects === null ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="h-8 w-8 text-brand-navy animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-center px-6">
            <FolderOpen className="h-12 w-12 text-brand-navy/40 mb-3" />
            <p className="font-medium text-brand-navy">Проєктів ще немає</p>
            <p className="text-sm text-muted-foreground">
              Натисніть «Додати проєкт», щоб створити перший запис.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ПІБ</TableHead>
                <TableHead>Компанія</TableHead>
                <TableHead className="hidden md:table-cell">ОПП</TableHead>
                <TableHead className="hidden lg:table-cell">Курс</TableHead>
                <TableHead>Рейтинг</TableHead>
                <TableHead className="text-right">Дії</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-medium">{p.studentName}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.group}
                    </div>
                  </TableCell>
                  <TableCell>{p.companyName}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                    {p.educationalProgram}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant="secondary">
                      {p.educationLevel} · {p.year}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {(p.ratingCount ?? 0) > 0 ? (
                      <span className="text-sm font-medium">
                        {((p.ratingSum ?? 0) / p.ratingCount!).toFixed(1)}/5
                        <span className="text-xs text-muted-foreground ml-1">
                          ({p.ratingCount})
                        </span>
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditing(p)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Редагувати</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleting(p)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Видалити</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Додати новий проєкт</DialogTitle>
          </DialogHeader>
          <AdminForm
            onSubmitted={() => {
              setCreateOpen(false);
              void load();
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редагування проєкту</DialogTitle>
          </DialogHeader>
          {editing && (
            <AdminForm
              initial={editing}
              onSubmitted={() => {
                setEditing(null);
                void load();
                router.refresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Видалити проєкт?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Ви впевнені, що хочете видалити проєкт{" "}
            <strong className="text-foreground">
              «{deleting?.projectTitle}»
            </strong>
            ? Цю дію не можна скасувати.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleting(null)}
              disabled={deletingBusy}
            >
              Скасувати
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deletingBusy}
            >
              {deletingBusy && <Loader2 className="h-4 w-4 animate-spin" />}
              Видалити
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
