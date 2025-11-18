export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="rounded-[2.5rem] border border-white/70 bg-white/90 p-10 text-center shadow-glass">
      <p className="text-sm uppercase tracking-[0.3em] text-brand">{title}</p>
      <h3 className="mt-4 font-display text-3xl text-ink">This module is on its way</h3>
      <p className="mt-3 text-slate-600">
        We are crafting the workflows so you can manage {title.toLowerCase()} seamlessly.
      </p>
    </div>
  )
}
