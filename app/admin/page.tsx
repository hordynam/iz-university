import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminPanel } from "@/components/AdminPanel";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <>
      <Header showLoginButton={false} />
      <main className="container py-8 flex-1">
        <AdminPanel />
      </main>
      <Footer />
    </>
  );
}
