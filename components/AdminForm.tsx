"use client";

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, CheckCircle2, Loader2, FileEdit } from "lucide-react";
import {
  projectInputSchema,
  type ProjectInput,
  type Project,
  type EducationLevel,
  type AnalogCompany,
} from "@/lib/types";

interface Suggestions {
  faculties: string[];
  academicYears: string[];
  educationalPrograms: string[];
}

interface AdminFormProps {
  initial?: Project;
  suggestions?: Suggestions;
  onSubmitted: () => void;
}

const DRAFT_KEY = "admin_new_project_draft";

const emptyForm: ProjectInput = {
  studentName: "",
  educationalProgram: "",
  educationLevel: "Бакалавр",
  faculty: "",
  year: 1,
  group: "",
  academicYear: "",
  companyName: "",
  projectTitle: "Поза темою кваліфікаційної роботи",
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

function ComboField({
  id,
  label,
  value,
  onChange,
  options,
  required,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
  placeholder?: string;
}) {
  const isCustom = value !== "" && !options.includes(value);
  const [mode, setMode] = useState<"select" | "custom">(
    isCustom ? "custom" : "select"
  );

  const switchToCustom = () => {
    setMode("custom");
    onChange("");
  };

  const switchToSelect = () => {
    setMode("select");
    onChange("");
  };

  if (options.length === 0 || mode === "custom") {
    return (
      <div className="space-y-1.5">
        <Label htmlFor={id}>{label}</Label>
        <div className="flex gap-2">
          <Input
            id={id}
            autoFocus={mode === "custom"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder ?? "Введіть значення"}
            required={required}
            className="flex-1"
          />
          {options.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 text-xs"
              onClick={switchToSelect}
            >
              Зі списку
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select
        value={value}
        onValueChange={(v) => {
          if (v === "__custom__") {
            switchToCustom();
          } else {
            onChange(v);
          }
        }}
      >
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder ?? "Оберіть або введіть..."} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
          <SelectSeparator />
          <SelectItem value="__custom__">Ввести своє...</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function AdminForm({ initial, suggestions, onSubmitted }: AdminFormProps) {
  const [form, setForm] = useState<ProjectInput>(
    initial ? toFormState(initial) : emptyForm
  );
  const [hasDraft, setHasDraft] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(
    initial?.pdfUrl ? true : false
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Skip saving on the very first effect run to avoid overwriting a real draft with emptyForm
  const skipFirstSave = useRef(true);

  // Restore draft on mount (create mode only)
  useEffect(() => {
    if (initial) return;
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<ProjectInput>;
        // Only restore if the user changed at least one field that is empty by default
        const hasContent = (Object.keys(emptyForm) as (keyof ProjectInput)[]).some((k) => {
          const val = parsed[k];
          const def = emptyForm[k];
          if (Array.isArray(val) && Array.isArray(def)) return val.length !== def.length;
          return val !== undefined && val !== def;
        });
        if (hasContent) {
          setForm((prev) => ({ ...prev, ...parsed }));
          setHasDraft(true);
        }
      }
    } catch {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save draft on every change (create mode only, skip initial render)
  useEffect(() => {
    if (initial) return;
    if (skipFirstSave.current) {
      skipFirstSave.current = false;
      return;
    }
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {}
  }, [form, initial]);

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setForm(emptyForm);
    setHasDraft(false);
    setUploadSuccess(false);
  };

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
      if (!initial) localStorage.removeItem(DRAFT_KEY);
      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {hasDraft && (
        <div className="flex items-center justify-between gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm">
          <div className="flex items-center gap-2 text-amber-800">
            <FileEdit className="h-4 w-4 shrink-0" />
            <span>Відновлено чернетку — продовжте заповнення</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-amber-700 hover:text-amber-900 hover:bg-amber-100 h-7 px-2"
            onClick={discardDraft}
          >
            Очистити
          </Button>
        </div>
      )}

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

          <ComboField
            id="educationalProgram"
            label="Освітньо-професійна програма *"
            value={form.educationalProgram}
            onChange={(v) => update("educationalProgram", v)}
            options={suggestions?.educationalPrograms ?? []}
            required
          />

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

          <ComboField
            id="faculty"
            label="Факультет *"
            value={form.faculty}
            onChange={(v) => update("faculty", v)}
            options={suggestions?.faculties ?? []}
            required
          />

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

          <ComboField
            id="academicYear"
            label="Навчальний рік *"
            value={form.academicYear}
            onChange={(v) => update("academicYear", v)}
            options={suggestions?.academicYears ?? []}
            placeholder="2024–2025"
            required
          />
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
