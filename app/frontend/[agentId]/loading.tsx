export default function AgentPageLoading() {
  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh' }}>

      {/* ── Nav skeleton ──────────────────────────────── */}
      <nav className="border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="h-4 w-40 rounded bg-stone-200 animate-pulse" />
          <div className="h-4 w-24 rounded bg-stone-200 animate-pulse" />
        </div>
      </nav>

      {/* ── Hero skeleton ─────────────────────────────── */}
      <header className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="h-3 w-32 rounded bg-stone-200 animate-pulse mb-5" />
        <div className="h-14 w-80 rounded bg-stone-200 animate-pulse mb-3" />
        <div className="h-3 w-48 rounded bg-stone-200 animate-pulse mb-8" />
        <div className="h-3 w-64 rounded bg-stone-200 animate-pulse" />
      </header>

      <div className="max-w-7xl mx-auto px-6">
        <hr className="border-stone-100" />
      </div>

      {/* ── Supplier grid skeleton ─────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center gap-6 mb-12">
          <div className="h-2.5 w-36 rounded bg-stone-200 animate-pulse" />
          <div className="flex-1 h-px bg-stone-100" />
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div
                className="w-full rounded bg-stone-200 animate-pulse"
                style={{ aspectRatio: '4 / 5' }}
              />
              <div className="mt-4 space-y-2.5">
                <div className="h-2 w-24 rounded bg-stone-200 animate-pulse" />
                <div className="h-5 w-40 rounded bg-stone-200 animate-pulse" />
                <div className="h-3 w-full rounded bg-stone-100 animate-pulse" />
                <div className="h-3 w-3/4 rounded bg-stone-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Instagram skeleton ────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center gap-6 mb-10">
          <div className="h-2.5 w-40 rounded bg-stone-200 animate-pulse" />
          <div className="flex-1 h-px bg-stone-100" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="w-full rounded bg-stone-200 animate-pulse"
              style={{ aspectRatio: i % 3 === 1 ? '1 / 1.4' : '1 / 1.1' }}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
