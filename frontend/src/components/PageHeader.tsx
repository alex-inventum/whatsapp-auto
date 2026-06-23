export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="px-6 md:px-8 py-6 border-b sticky top-0 z-20" style={{
      borderColor: 'rgba(255,255,255,0.06)',
      background: 'rgba(5, 5, 5, 0.7)',
      backdropFilter: 'blur(32px)',
      WebkitBackdropFilter: 'blur(32px)',
      boxShadow: '0 1px 0 rgba(255,255,255,0.03), 0 4px 20px rgba(0,0,0,0.2)',
    }}>
      <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{title}</h1>
      {subtitle && <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>}
    </header>
  );
}
