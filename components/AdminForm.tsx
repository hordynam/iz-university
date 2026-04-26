"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import {
  projectInputSchema,
  type ProjectInput,
  type Project,
  type EducationLevel,
  type AnalogCompany,
} from "@/lib/types";

interface AdminFormProps {
  initial?: Project;
  onSubmitted: () => void;
}

const emptyForm: ProjectInput = {
  studentName: "",
  educationalProgram: "",
  educationLevel: "Бакалавр",
  faculty: "",
  year: 1,
  group: "",
  academicYear: "",
  companyName: "",
  projectTitle: "",
  description: "",
  pdfUrl: "",
  externalReportUrl: "",
  analogCompanies: [],
};

function toFormState(p: Project): ProjectInput {
  return {
    studentName: p.studentName,
    educationalProgram: p.educationalProgram,
    educationLevel: p.educationLevel,
    faculty: p.faculty,
    year: p.year,
    group: p.group,
    academicYear: p.academicYear,
    companyName: p.companyName,
    projectTitle: p.projectTitle,
    description: p.description,
    pdfUrl: p.pdfUrl ?? "",
    externalReportUrl: p.externalReportUrl ?? "",
    analogCompanies: p.analogCompanies,
  };
}

export function AdminForm({ initial, onSubmitted }: AdminFormProps) {
  const [form, setForm] = useState<ProjectInput>(
    initial ? toFormState(initial) : emptyForm
  );
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(
    initial?.pdfUrl ? true : false
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ProjectInput>(
    key: K,
    value: ProjectInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateAnalog = (
    index: number,
    key: keyof AnalogCompany,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      analogCompanies: prev.analogCompanies.map((a, i) =>
        i === index ? { ...a, [key]: value } : a
      ),
    }));
  };

  const addAnalog = () => {
    setForm((prev) => ({
      ...prev,
      analogCompanies: [...prev.analogCompanies, { name: "", reportUrl: "" }],
    }));
  };

  const removeAnalog = (index: number) => {
    setForm((prev) => ({
      ...prev,
      analogCompanies: prev.analogCompanies.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Файл має бути у форматі PDF");
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setError("Розмір файлу не має перевищувати 30 МБ");
      return;
    }

    setError(null);
    setUploading(true);
    setUploadSuccess(false);

    try {
      const blob = await upload(
        `reports/${crypto.randomUUID()}-${file.name}`,
        file,
        {
          access: "private",
          handleUploadUrl: "/api/upload",
          contentType: "application/pdf",
        }
      );
      update("pdfUrl", blob.url);
      setUploadSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка завантаження");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = projectInputSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Перевірте форму");
      return;
    }

    setSubmitting(true);
    try {
      const url = initial
        ? `/api/projects/${initial.id}`
        : "/api/projects";
      const method = initial ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Помилка збереження");
      }
      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <section className="space-y-4">
        <h3 className="font-semibold text-brand-navy border-b border-border pb-2">
          Інформація про здобувача
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="studentName">ПІБ *</Label>
            <Input
              id="studentName"
              value={form.studentName}
              onChange={(e) => update("studentName", e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="educationalProgram">
              Освітньо-професійна програма *
            </Label>
            <Input
              id="educationalProgram"
              value={form.educationalProgram}
              onChange={(e) => update("educationalProgram", e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Рівень освіти *</Label>
            <Select
              value={form.educationLevel}
              onValueChange={(v) =>
                update("educationLevel", v as EducationLevel)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Бакалавр">Бакалавр</SelectItem>
                <SelectItem value="Магістр">Магістр</SelectItem>
                <SelectItem value="Аспірант">Аспірант</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="faculty">Факультет *</Label>
            <Input
              id="faculty"
              value={form.faculty}
              onChange={(e) => update("faculty", e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Курс *</Label>
            <Select
              value={String(form.year)}
              onValueChange={(v) => update("year", Number(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y} курс
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="group">Група *</Label>
            <Input
              id="group"
              value={form.group}
              onChange={(e) => update("group", e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="academicYear">Навчальний рік *</Label>
            <Input
              id="academicYear"
              placeholder="2024–2025"
              value={form.academicYear}
              onChange={(e) => update("academicYear", e.target.value)}
              required
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-brand-navy border-b border-border pb-2">
          Про проєкт
        </h3>

        <div className="space-y-1.5">
          <Label htmlFor="companyName">Назва підприємства *</Label>
          <Input
            id="companyName"
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="projectTitle">Тема роботи *</Label>
          <Input
            id="projectTitle"
            value={form.projectTitle}
            onChange={(e) => update("projectTitle", e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">
            Короткий опис ({form.description.length}/500)
          </Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            maxLength={500}
            rows={4}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-brand-navy border-b border-border pb-2">
          Файл звіту
        </h3>

        <div className="space-y-1.5">
          <Label htmlFor="pdfFile">Завантажити PDF (макс. 30 МБ)</Label>
          <div className="flex items-center gap-3">
            <Input
              id="pdfFile"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              disabled={uploading}
            />
            {uploading && (
              <Loader2 className="h-5 w-5 text-brand-navy animate-spin shrink-0" />
            )}
            {uploadSuccess && !uploading && (
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
            )}
          </div>
          {form.pdfUrl && (
            <p className="text-xs text-muted-foreground truncate">
              Поточний файл: {form.pdfUrl}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="externalReportUrl">Або зовнішня URL звіту</Label>
          <Input
            id="externalReportUrl"
            type="url"
            placeholder="https://..."
            value={form.externalReportUrl ?? ""}
            onChange={(e) => update("externalReportUrl", e.target.value)}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h3 className="font-semibold text-brand-navy">
            Підприємства-аналоги
          </h3>
          <Button type="button" size="sm" variant="outline" onClick={addAnalog}>
            <Plus className="h-4 w-4" />
            Додати
          </Button>
        </div>

        {form.analogCompanies.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Жодне підприємство-аналог не додане.
          </p>
        )}

        <div className="space-y-3">
          {form.analogCompanies.map((a, i) => (
            <div key={i} className="flex items-start gap-2">
              <Input
                placeholder="Назва компанії"
                value={a.name}
                onChange={(e) => updateAnalog(i, "name", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="URL звіту"
                type="url"
                value={a.reportUrl}
                onChange={(e) => updateAnalog(i, "reportUrl", e.target.value)}
                className="flex-[2]"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeAnalog(i)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2 border-t border-border">
        <Button type="submit" disabled={submitting || uploading}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {initial ? "Зберегти зміни" : "Створити проєкт"}
        </Button>
      </div>
    </form>
  );
}
