export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center lg:grid lg:grid-cols-2">
      {/* Left panel — particle logo */}
      <div className="hidden lg:flex items-center justify-center relative overflow-hidden h-screen bg-[#080808]">
        <div className="w-[400px] h-[400px]">
          {/* Static logo for auth layout; ParticleLogo is on individual pages */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <svg width="120" height="120" viewBox="0 0 100 100" fill="none" className="mx-auto mb-4 animate-pulse-glow">
                <rect x="50" y="3" width="66" height="66" rx="4" fill="#0A0A0A" stroke="#4DD9D9" strokeWidth="2" transform="rotate(45 50 50)" />
                <text x="50" y="44" textAnchor="middle" fill="white" fontSize="22" fontFamily="Georgia, serif">R</text>
                <line x1="38" y1="52" x2="62" y2="52" stroke="white" strokeWidth="1.5" opacity="0.6" />
                <text x="50" y="68" textAnchor="middle" fill="white" fontSize="22" fontFamily="Georgia, serif">A</text>
              </svg>
              <p className="text-[#4DD9D9] tracking-[0.4em] text-sm uppercase font-light" style={{ fontFamily: 'Georgia, serif' }}>Rivonia AI</p>
              <p className="text-white/30 text-xs tracking-widest mt-2 uppercase">Agency Intelligence Platform</p>
            </div>
          </div>
        </div>
        {/* decorative grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(77,217,217,1) 1px, transparent 1px), linear-gradient(90deg, rgba(77,217,217,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center w-full min-h-screen p-6">
        {children}
      </div>
    </div>
  )
}
