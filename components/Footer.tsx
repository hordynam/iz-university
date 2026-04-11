export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-surface mt-16">
      <div className="container py-8 text-center text-sm text-muted-foreground">
        <p className="font-medium text-foreground">
          © {year} ДТЕУ. Кафедра обліку та оподаткування.
        </p>
        <p className="mt-1">
          Державний торговельно-економічний університет, Київ
        </p>
      </div>
    </footer>
  );
}
