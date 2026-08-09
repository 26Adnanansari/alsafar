export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-semibold text-white">Al-Safar <span className="text-gold">Hajj & Umrah</span></h1>
          <p className="mt-1 text-sm text-white/60">Licensed Tour Operator — Pakistan</p>
        </div>
        {children}
      </div>
    </div>
  );
}
