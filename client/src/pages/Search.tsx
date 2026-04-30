import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getArticles } from '../lib/api'
import ArticleCard from '../components/ArticleCard'
import type { Article } from '../types/article'

export default function Search() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q) return
    setLoading(true)
    getArticles({ q })
      .then((data) => setArticles(data.articles))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [q])

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 max-w-7xl mx-auto">
      {q && (
        <h1 className="text-xl font-semibold text-gray-800 mb-6">
          Results for: <span className="text-blue-600">{q}</span>
        </h1>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
      ) : articles.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No results found for "{q}"</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
