export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 border-b border-ink-100 pb-6 sm:flex-row sm:items-center">
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-fcs-700">SAZU FCS · Administration</p>
        <h1 className="text-2xl font-display text-ink sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
