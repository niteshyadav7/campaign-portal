export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden border-r border-white/60 bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg bg-white text-sm font-bold text-slate-950">
              1to7
            </div>
            <div>
              <p className="text-sm font-semibold">1to7 Media</p>
              <p className="text-xs text-slate-400">Campaign operations portal</p>
            </div>
          </div>
          <div className="mt-24 max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">
              Creator decisions, cleaner
            </p>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight">
              A sharper workspace for influencer campaign approvals.
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-300">
              Manage brand access, present creator shortlists, and capture client decisions without spreadsheet drift.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          {['Brands', 'Campaigns', 'Creators'].map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <p className="font-semibold">{item}</p>
              <p className="mt-1 text-xs text-slate-400">Ready to review</p>
            </div>
          ))}
        </div>
      </section>
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
