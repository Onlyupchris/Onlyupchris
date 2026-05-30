import { cn } from '@/lib/utils'

type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const sizes: Record<LogoSize, { w: number; fontSize: number; lineY: number; rY: number; aY: number; textSize: string; subSize: string; gap: string }> = {
  xs: { w: 36,  fontSize: 12, lineY: 50, rY: 40, aY: 63, textSize: 'text-xs',  subSize: 'text-[8px]',  gap: 'gap-1.5' },
  sm: { w: 48,  fontSize: 16, lineY: 50, rY: 40, aY: 63, textSize: 'text-sm',  subSize: 'text-[10px]', gap: 'gap-2' },
  md: { w: 64,  fontSize: 20, lineY: 50, rY: 40, aY: 63, textSize: 'text-base',subSize: 'text-xs',     gap: 'gap-2.5' },
  lg: { w: 88,  fontSize: 26, lineY: 50, rY: 40, aY: 63, textSize: 'text-xl',  subSize: 'text-sm',     gap: 'gap-3' },
  xl: { w: 130, fontSize: 38, lineY: 50, rY: 40, aY: 63, textSize: 'text-3xl', subSize: 'text-lg',     gap: 'gap-4' },
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
  const { w, fontSize, rY, aY, textSize, subSize, gap } = sizes[size]

  return (
    <div className={cn('flex flex-col items-center', gap, className)}>
      {/* Diamond SVG — using polygon so corners never clip */}
      <svg width={w} height={w} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Diamond shape */}
        <polygon
          points="50,4 96,50 50,96 4,50"
          fill="#0A0A0A"
          stroke="#4DD9D9"
          strokeWidth="2.5"
        />
        {/* R */}
        <text
          x="50"
          y={rY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={fontSize}
          fontFamily="Georgia, 'Times New Roman', serif"
          fontWeight="400"
        >
          R
        </text>
        {/* Divider line */}
        <line
          x1="33" y1="50" x2="67" y2="50"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1"
        />
        {/* A */}
        <text
          x="50"
          y={aY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={fontSize}
          fontFamily="Georgia, 'Times New Roman', serif"
          fontWeight="400"
        >
          A
        </text>
      </svg>

      {showText && (
        <div className="flex flex-col items-center gap-0.5">
          <span
            className={cn('font-light tracking-[0.25em] text-white uppercase', textSize)}
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Rivonia
          </span>
          <span className={cn('tracking-[0.4em] text-[#4DD9D9] uppercase font-light', subSize)}>
            AI
          </span>
        </div>
      )}
    </div>
  )
}
