export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="px-6 md:px-8 py-6 border-b sticky top-0 z-20" style={{ borderColor: 'var(--border)', background: 'rgba(17,27,33,0.85)', backdropFilter: 'blur(12px)' }}>
      <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
      {subtitle && <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>}
    </header>
  );
}
