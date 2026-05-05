export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-100 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-emerald-600/5 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-md px-4">
        {children}
      </div>
    </div>
  )
}
