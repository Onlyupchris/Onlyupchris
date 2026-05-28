import { cn } from '@/lib/utils'

type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const sizes: Record<LogoSize, { diamond: number; text: string; sub: string }> = {
  xs: { diamond: 32, text: 'text-xs', sub: 'text-[8px]' },
  sm: { diamond: 44, text: 'text-sm', sub: 'text-[10px]' },
  md: { diamond: 60, text: 'text-base', sub: 'text-xs' },
  lg: { diamond: 80, text: 'text-xl', sub: 'text-sm' },
  xl: { diamond: 120, text: 'text-3xl', sub: 'text-lg' },
}

export function RivoniaLogo({
  size = 'md',
  showText = true,
  className,
}: {
  size?: LogoSize
  showText?: boolean
  className?: string
}) {
  const { diamond, text, sub } = sizes[size]
  const half = diamond / 2

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <svg width={diamond} height={diamond} viewBox="0 0 100 100" fill="none">
        <rect
          x="50"
          y="3"
          width="66"
          height="66"
          rx="4"
          fill="#0A0A0A"
          stroke="#4DD9D9"
          strokeWidth="2"
          transform="rotate(45 50 50)"
        />
        <text
          x="50"
          y="44"
          textAnchor="middle"
          fill="white"
          fontSize="22"
          fontFamily="Georgia, serif"
          fontWeight="400"
        >
          R
        </text>
        <line x1="38" y1="52" x2="62" y2="52" stroke="white" strokeWidth="1.5" opacity="0.6" />
        <text
          x="50"
          y="68"
          textAnchor="middle"
          fill="white"
          fontSize="22"
          fontFamily="Georgia, serif"
          fontWeight="400"
        >
          A
        </text>
      </svg>
      {showText && (
        <div className="flex flex-col items-center gap-0.5">
          <span
            className={cn('font-light tracking-[0.25em] text-white uppercase', text)}
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Rivonia
          </span>
          <span className={cn('tracking-[0.4em] text-[#4DD9D9] uppercase font-light', sub)}>
            AI
          </span>
        </div>
      )}
    </div>
  )
}
