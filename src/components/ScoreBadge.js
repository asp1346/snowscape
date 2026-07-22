import { scoreColorClasses } from '../lib/conditions.js'

export default function ScoreBadge({ score, size = 'sm' }) {
  if (score == null) return null

  const { text, bg, border } = scoreColorClasses(score)

  if (size === 'lg') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-sm font-semibold rounded-full border px-3 py-1 flex-shrink-0 ${text} ${bg} ${border}`}>
        <span className="text-base">{score}</span>
        <span className="font-normal text-neutral-400">conditions score</span>
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center justify-center text-xs font-semibold rounded-full border px-2 py-0.5 min-w-[2rem] flex-shrink-0 ${text} ${bg} ${border}`}>
      {score}
    </span>
  )
}
