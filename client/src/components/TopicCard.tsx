import type { Topic } from '../types/topic'

interface Props {
  topic: Topic
}

export default function TopicCard({ topic }: Props) {
  const visibleSources = topic.sources.slice(0, 3)
  const extraCount = topic.sources.length - 3

  return (
    <div className="bg-white rounded-xl shadow-sm border-l-4 border-green-500 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h2 className="text-base font-bold text-gray-900 leading-snug">{topic.name}</h2>
        <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full capitalize bg-green-100 text-green-800">
          {topic.category}
        </span>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-4">{topic.briefing}</p>

      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Sources</p>
        <div className="flex flex-col gap-1">
          {visibleSources.map((source) => (
            <a
              key={source.articleId}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-green-700 hover:underline truncate"
            >
              {source.name}
            </a>
          ))}
          {extraCount > 0 && (
            <span className="text-xs text-gray-400">+{extraCount} more</span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Covered by {topic.sources.length} source{topic.sources.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
