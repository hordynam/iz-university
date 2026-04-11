# ДТЕУ — База проєктів інтегрованих звітів здобувачів

Next.js 14 (App Router, TypeScript, Tailwind CSS) веб-застосунок для кафедри обліку та оподаткування Державного торговельно-економічного університету (ДТЕУ, Київ). Сайт використовується для публікації та перегляду студентських проєктів з дисципліни "Інтегрована звітність".

## Технологічний стек

- Next.js 14 (App Router, TypeScript, React Server Components)
- Tailwind CSS + shadcn/ui примітиви
- Vercel KV (Upstash Redis) — зберігання даних проєктів
- Vercel Blob — зберігання PDF-файлів
- Zod — валідація форм

## Функціонал

- Публічна галерея проєктів з фільтрами (факультет, рівень освіти, курс, навчальний рік, рейтинг) та пошуком
- Сторінка окремого проєкту з вбудованим PDF-переглядачем
- Захищена адміністративна панель (парольна автентифікація, httpOnly cookie)
- CRUD операції: створення, редагування, видалення проєктів
- Завантаження PDF-файлів (до 10 МБ) у Vercel Blob
- Система рейтингу на 5 рівнів із емодзі
- Повністю адаптивний дизайн (mobile-first)
- Усі елементи інтерфейсу українською мовою

## Deploy-інструкція

### 1. Встановлення залежностей

```bash
npm install
```

### 2. Створення проєкту на Vercel

Перейдіть на [vercel.com](https://vercel.com), увійдіть, натисніть **Add New → Project** та імпортуйте цей репозиторій.

### 3. Підключення Vercel KV (Upstash Redis)

У дашборді проєкту на Vercel:

1. Відкрийте вкладку **Storage**
2. Натисніть **Create Database → KV (Upstash Redis)**
3. Введіть назву, виберіть регіон (найближчий — Frankfurt)
4. Натисніть **Connect Project** та оберіть цей проєкт

### 4. Підключення Vercel Blob

У вкладці **Storage** того ж дашборду:

1. Натисніть **Create → Blob**
2. Введіть назву сховища
3. Натисніть **Connect Project** та оберіть цей проєкт

### 5. Налаштування змінних середовища

Виконайте локально для завантаження змінних KV та Blob:

```bash
npx vercel link
npx vercel env pull .env.local
```

Додайте пароль адміністратора у дашборді Vercel → **Settings → Environment Variables**:

```
ADMIN_PASSWORD=ваш_надійний_пароль
```

Після додавання виконайте `npx vercel env pull .env.local` знову, щоб синхронізувати локальне середовище.

Приклад `.env.local`:

```env
ADMIN_PASSWORD=changeme

KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=

BLOB_READ_WRITE_TOKEN=
```

### 6. Deploy

```bash
npx vercel deploy --prod
```

Або просто запушіть зміни у main-гілку, якщо підключений GitHub.

### 7. Заповнення демо-даними (опційно)

Після першого деплою (і коли `.env.local` містить токени KV/Blob) запустіть сід-скрипт локально:

```bash
npm run seed
```

Скрипт створить 6 демонстраційних проєктів (Нова Пошта, Укрпошта, Київстар, МХП, Укрзалізниця, Укренерго).

## Локальна розробка

```bash
npm install
npm run dev
```

Застосунок буде доступний на [http://localhost:3000](http://localhost:3000).

Для повноцінної роботи з KV/Blob локально потрібні відповідні токени у `.env.local` (див. крок 5).

## Структура проєкту

```
/app
  /page.tsx                    — Головна сторінка (галерея проєктів)
  /projects/[id]/page.tsx      — Сторінка окремого проєкту
  /admin/page.tsx              — Адмін-панель
  /admin/login/page.tsx        — Сторінка входу
  /api/projects/route.ts       — GET, POST
  /api/projects/[id]/route.ts  — GET, PUT, DELETE
  /api/upload/route.ts         — Завантаження PDF
  /api/auth/route.ts           — Авторизація
  /api/logout/route.ts         — Вихід
/components
  /ui/                         — shadcn/ui примітиви
  /Header.tsx, Footer.tsx
  /ProjectCard.tsx, CatalogView.tsx, FilterBar.tsx
  /AdminPanel.tsx, AdminForm.tsx, LoginForm.tsx
  /RatingBadge.tsx
/lib
  /types.ts                    — TypeScript інтерфейси та Zod схеми
  /kv.ts                       — Vercel KV helper-функції
  /rating.ts                   — Логіка відображення рейтингу
  /auth.ts                     — Утиліти автентифікації
  /utils.ts                    — cn() helper
/middleware.ts                 — Захист /admin маршрутів
/scripts/seed.ts               — Скрипт заповнення демо-даними
```

## Адміністративний доступ

1. Перейдіть на `/admin/login`
2. Введіть пароль зі змінної `ADMIN_PASSWORD`
3. Після успішного входу ви будете перенаправлені до `/admin`

Сесія зберігається у httpOnly cookie `admin_session` зі строком дії 8 годин.
