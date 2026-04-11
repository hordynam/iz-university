import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoginForm } from "@/components/LoginForm";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  if (isAuthenticated()) {
    redirect("/admin");
  }

  return (
    <>
      <Header showLoginButton={false} />
      <main className="container py-16 flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-brand-navy">
                Вхід до адміністративної панелі
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Доступ лише для адміністраторів кафедри
              </p>
            </div>
            <LoginForm />
          </div>
          <div className="text-center mt-4">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-brand-navy"
            >
              ← До бази проєктів
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
