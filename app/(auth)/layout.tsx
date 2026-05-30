import { ParticleLogo } from '@/components/brand/ParticleLogo'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center lg:grid lg:grid-cols-2">
      {/* Left panel — particle logo animation */}
      <div className="hidden lg:flex items-center justify-center relative overflow-hidden h-screen bg-[#080808]">
        <div className="w-[400px] h-[400px]">
          <ParticleLogo />
        </div>
        {/* Tagline below the animation area */}
        <div className="absolute bottom-12 text-center">
          <p className="text-white/20 text-xs tracking-[0.3em] uppercase">Agency Intelligence Platform</p>
        </div>
        {/* decorative grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
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
