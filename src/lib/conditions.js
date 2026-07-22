export function conditionColor(depth) {
  if (depth > 60) return 'bg-emerald-500'
  if (depth > 30) return 'bg-blue-500'
  return 'bg-amber-500'
}

export function snowColor(inches) {
  if (inches > 2) return 'text-blue-400'
  if (inches > 0) return 'text-blue-300'
  return 'text-neutral-600'
}
