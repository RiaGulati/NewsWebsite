import type { Article } from '../types/article'

const CATEGORY_COLORS: Record<string, string> = {
  technology: 'bg-blue-100 text-blue-800',
  business: 'bg-green-100 text-green-800',
  health: 'bg-red-100 text-red-800',
  science: 'bg-purple-100 text-purple-800',
  sports: 'bg-yellow-100 text-yellow-800',
  entertainment: 'bg-pink-100 text-pink-800',
  politics: 'bg-orange-100 text-orange-800',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function ArticleCard({ article }: { article: Article }) {
  const badgeClass =
    CATEGORY_COLORS[article.category?.toLowerCase()] ?? 'bg-gray-100 text-gray-800'

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {article.urlToImage ? (
        <img
          src={article.urlToImage}
          alt={article.title}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="h-48 w-full bg-gray-200" />
      )}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{article.source}</span>
          {article.category && (
            <span className={`px-2 py-0.5 rounded-full font-medium ${badgeClass}`}>
              {article.category}
            </span>
          )}
        </div>
        <h2 className="font-bold text-gray-900 line-clamp-2 leading-snug">{article.title}</h2>
        {article.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{article.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs text-gray-400">{formatDate(article.publishedAt)}</span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            Read more →
          </a>
        </div>
      </div>
    </div>
  )
}
