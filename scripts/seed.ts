import { config } from "dotenv";
config({ path: ".env.local" });

import { createProject } from "../lib/kv";
import type { Project } from "../lib/types";

type SeedProject = Omit<Project, "id" | "createdAt" | "updatedAt">;

const projects: SeedProject[] = [
  {
    studentName: "Коваленко Марія Сергіївна",
    educationalProgram: "Облік і оподаткування",
    educationLevel: "Магістр",
    faculty: "Факультет обліку, аудиту та інформаційних систем",
    year: 5,
    group: "5М-ОА-1",
    academicYear: "2024–2025",
    companyName: "Нова Пошта",
    projectTitle:
      "Формування інтегрованої звітності логістичного підприємства на прикладі ТОВ «Нова Пошта»",
    description:
      "Дослідження принципів формування інтегрованої звітності з урахуванням специфіки логістичної галузі та її впливу на капітал підприємства.",
    externalReportUrl: "https://novaposhta.ua/sustainability",
    analogCompanies: [
      {
        name: "DHL Group",
        reportUrl:
          "https://examples.integratedreporting.ifrs.org/organizations/",
      },
      {
        name: "FedEx",
        reportUrl:
          "https://examples.integratedreporting.ifrs.org/organizations/",
      },
    ],
    rating: 5,
  },
  {
    studentName: "Петренко Олексій Іванович",
    educationalProgram: "Фінанси, банківська справа та страхування",
    educationLevel: "Бакалавр",
    faculty: "Фінансово-економічний факультет",
    year: 4,
    group: "4Б-ФБ-2",
    academicYear: "2024–2025",
    companyName: "Укрпошта",
    projectTitle:
      "Аналіз впливу державної підтримки на капітал АТ «Укрпошта» в інтегрованій звітності",
    description:
      "Оцінка шести форм капіталу за моделлю IIRC у звітності державного оператора поштового зв'язку.",
    externalReportUrl: "https://ukrposhta.ua/ua/pro-nas",
    analogCompanies: [
      {
        name: "Royal Mail",
        reportUrl:
          "https://examples.integratedreporting.ifrs.org/organizations/",
      },
    ],
    rating: 4,
  },
  {
    studentName: "Савченко Олена Вікторівна",
    educationalProgram: "Маркетинг",
    educationLevel: "Магістр",
    faculty: "Факультет економіки, менеджменту та психології",
    year: 6,
    group: "6М-МК-1",
    academicYear: "2023–2024",
    companyName: "Київстар",
    projectTitle:
      "Інтегрована звітність як інструмент комунікації з стейкхолдерами телеком-оператора",
    description:
      "Аналіз ролі інтегрованої звітності у формуванні довіри стейкхолдерів в умовах цифрової трансформації галузі зв'язку.",
    externalReportUrl: "https://kyivstar.ua/uk/about/about",
    analogCompanies: [
      {
        name: "Vodafone Group",
        reportUrl:
          "https://examples.integratedreporting.ifrs.org/organizations/",
      },
      {
        name: "Deutsche Telekom",
        reportUrl:
          "https://examples.integratedreporting.ifrs.org/organizations/",
      },
    ],
    rating: 5,
  },
  {
    studentName: "Гриценко Дмитро Андрійович",
    educationalProgram: "Облік і оподаткування",
    educationLevel: "Бакалавр",
    faculty: "Факультет обліку, аудиту та інформаційних систем",
    year: 3,
    group: "3Б-ОА-3",
    academicYear: "2024–2025",
    companyName: "МХП",
    projectTitle:
      "Розкриття нефінансової інформації в інтегрованій звітності агрохолдингу МХП",
    description:
      "Аналіз практики розкриття ESG-показників та моделей створення вартості у звітності агропромислового холдингу.",
    externalReportUrl: "https://mhp.com.ua/uk/for-investors/reporting",
    analogCompanies: [
      {
        name: "Marfrig Global Foods",
        reportUrl:
          "https://examples.integratedreporting.ifrs.org/organizations/",
      },
    ],
    rating: 3,
  },
  {
    studentName: "Бондар Анастасія Олегівна",
    educationalProgram: "Підприємництво, торгівля та біржова діяльність",
    educationLevel: "Аспірант",
    faculty: "Факультет міжнародної торгівлі та права",
    year: 2,
    group: "АСП-ПТБ-2",
    academicYear: "2024–2025",
    companyName: "Укрзалізниця",
    projectTitle:
      "Методологічні підходи до формування інтегрованої звітності природних монополій",
    description:
      "Дисертаційне дослідження особливостей розкриття стратегічної інформації у звітності суб'єктів природних монополій.",
    externalReportUrl: "https://www.uz.gov.ua/press_center/",
    analogCompanies: [
      {
        name: "SNCF Group",
        reportUrl:
          "https://examples.integratedreporting.ifrs.org/organizations/",
      },
      {
        name: "Deutsche Bahn",
        reportUrl:
          "https://examples.integratedreporting.ifrs.org/organizations/",
      },
    ],
    rating: 4,
  },
  {
    studentName: "Мельник Іван Павлович",
    educationalProgram: "Економіка",
    educationLevel: "Магістр",
    faculty: "Фінансово-економічний факультет",
    year: 5,
    group: "5М-ЕК-1",
    academicYear: "2023–2024",
    companyName: "Укренерго",
    projectTitle:
      "Інтегрована звітність як інструмент розкриття інформації про сталий розвиток НЕК «Укренерго»",
    description:
      "Оцінка впливу інтегрованої звітності на управлінські рішення у сфері енергетичної безпеки та сталого розвитку.",
    externalReportUrl: "https://ua.energy/zvit/",
    analogCompanies: [
      {
        name: "Enel Group",
        reportUrl:
          "https://examples.integratedreporting.ifrs.org/organizations/",
      },
    ],
    rating: 2,
  },
];

async function main() {
  console.log(`Seeding ${projects.length} projects...`);

  for (const p of projects) {
    const created = await createProject(p);
    console.log(`  ✓ ${created.companyName} — ${created.studentName}`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
