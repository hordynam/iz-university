import { z } from "zod";

export type EducationLevel = "Бакалавр" | "Магістр" | "Аспірант";
export type Rating = 1 | 2 | 3 | 4 | 5;

export interface AnalogCompany {
  name: string;
  reportUrl: string;
}

export interface Project {
  id: string;
  createdAt: string;
  updatedAt: string;

  studentName: string;
  educationalProgram: string;
  educationLevel: EducationLevel;
  faculty: string;
  year: number;
  group: string;
  academicYear: string;

  companyName: string;
  projectTitle: string;
  description: string;

  pdfUrl?: string;
  externalReportUrl?: string;

  analogCompanies: AnalogCompany[];

  ratingSum: number;
  ratingCount: number;
}

export const analogCompanySchema = z.object({
  name: z.string().min(1, "Назва обов'язкова"),
  reportUrl: z.string().url("Невірний формат URL"),
});

export const projectInputSchema = z
  .object({
    studentName: z.string().min(1, "ПІБ обов'язкове"),
    educationalProgram: z.string().min(1, "ОПП обов'язкова"),
    educationLevel: z.enum(["Бакалавр", "Магістр", "Аспірант"]),
    faculty: z.string().min(1, "Факультет обов'язковий"),
    year: z.number().int().min(1).max(6),
    group: z.string().min(1, "Група обов'язкова"),
    academicYear: z.string().min(1, "Навчальний рік обов'язковий"),
    companyName: z.string().min(1, "Назва підприємства обов'язкова"),
    projectTitle: z.string().min(1, "Тема роботи обов'язкова"),
    description: z.string().max(500, "Максимум 500 символів"),
    pdfUrl: z.string().url().optional().or(z.literal("")),
    externalReportUrl: z.string().url().optional().or(z.literal("")),
    analogCompanies: z.array(analogCompanySchema),
  })
  .refine(
    (data) =>
      (data.pdfUrl && data.pdfUrl.length > 0) ||
      (data.externalReportUrl && data.externalReportUrl.length > 0),
    {
      message: "Необхідно завантажити PDF або вказати зовнішнє посилання",
      path: ["pdfUrl"],
    }
  );

export type ProjectInput = z.infer<typeof projectInputSchema>;
