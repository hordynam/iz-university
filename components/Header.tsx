import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

interface HeaderProps {
  showLoginButton?: boolean;
}

export function Header({ showLoginButton = true }: HeaderProps) {
  return (
    <header className="bg-brand-navy text-white shadow-md">
      <div className="container py-6">
        <div className="flex items-start justify-between gap-4">
          <Link href="/" className="flex-1 group">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-brand-gold flex items-center justify-center text-brand-navy font-bold text-xl shrink-0">
                ДТЕУ
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight group-hover:text-brand-gold-light transition-colors">
                  ДТЕУ — Інтегрована звітність
                </h1>
                <p className="text-sm md:text-base text-white/80 mt-1">
                  База проєктів інтегрованих звітів здобувачів
                </p>
              </div>
            </div>
          </Link>
          {showLoginButton && (
            <Link href="/admin/login">
              <Button variant="gold" size="sm" className="shrink-0">
                <LogIn className="h-4 w-4" />
                Увійти
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div className="h-1 bg-brand-gold" />
    </header>
  );
}
