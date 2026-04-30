import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getArticles } from '../lib/api'
import ArticleCard from '../components/ArticleCard'
import type { Article } from '../types/article'

export default function Category() {
  const { name } = useParams<{ name: string }>()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!name) return
    setLoading(true)
    getArticles({ category: name })
      .then((data) => setArticles(data.articles))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [name])

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 capitalize">{name}</h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
      ) : articles.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No articles in this category.</p>
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
