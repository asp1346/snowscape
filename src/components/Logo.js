export default function Logo({ variant = 'onLight', size = 28, className = '' }) {
  const barColor = variant === 'onDark' ? '#fff' : 'oklch(0.22 0.035 255)'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="0" y="23.5" width="56" height="9" rx="4.5" fill={barColor} />
      <rect x="0" y="23.5" width="56" height="9" rx="4.5" fill={barColor} transform="rotate(60 28 28)" />
      <rect x="0" y="23.5" width="56" height="9" rx="4.5" fill={barColor} transform="rotate(120 28 28)" />
      <rect x="21" y="21" width="14" height="14" rx="4" fill="oklch(0.72 0.14 215)" />
    </svg>
  )
}
