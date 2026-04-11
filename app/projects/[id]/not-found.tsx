import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileSearch } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="container py-20 flex-1 flex flex-col items-center text-center">
        <FileSearch className="h-16 w-16 text-brand-navy/40 mb-4" />
        <h1 className="text-2xl font-bold text-brand-navy mb-2">
          Проєкт не знайдено
        </h1>
        <p className="text-muted-foreground mb-6">
          Можливо, його було видалено або посилання застаріло.
        </p>
        <Link href="/">
          <Button>
            <ArrowLeft className="h-4 w-4" />
            До бази проєктів
          </Button>
        </Link>
      </main>
      <Footer />
    </>
  );
}
