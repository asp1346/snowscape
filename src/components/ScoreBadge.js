import { scoreColorClasses } from '../lib/conditions.js'

export default function ScoreBadge({ score, size = 'sm' }) {
  if (score == null) return null

  const { text, bg, border } = scoreColorClasses(score)

  if (size === 'lg') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-[13px] rounded-lg border px-3 py-1.5 flex-shrink-0 ${text} ${bg} ${border}`}>
        <span className="font-display font-bold">{score}</span>
        <span className="font-medium text-ink-muted">conditions score</span>
      </span>
    )
  }

  return (
    <span className={`font-display inline-flex items-center justify-center text-xs font-bold rounded-md border px-2 py-0.5 min-w-[2rem] flex-shrink-0 ${text} ${bg} ${border}`}>
      {score}
    </span>
  )
}
