import { useState, useEffect } from 'react'
import { getArticles, getCategories } from '../lib/api'
import ArticleCard from '../components/ArticleCard'
import type { Article } from '../types/article'

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string | undefined>()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)
    getArticles({ category: activeCategory, page })
      .then((data) => {
        setArticles((prev) => (page === 1 ? data.articles : [...prev, ...data.articles]))
        setTotalPages(data.totalPages)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activeCategory, page])

  function selectCategory(cat: string | undefined) {
    setActiveCategory(cat)
    setPage(1)
    setArticles([])
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => selectCategory(undefined)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeCategory === undefined
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => selectCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              activeCategory === cat
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && articles.length === 0 ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
      ) : articles.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No articles found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}

      {page < totalPages && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm hover:bg-gray-700 transition-colors"
          >
            Load more
          </button>
        </div>
      )}

      {loading && articles.length > 0 && (
        <div className="flex justify-center mt-8">
          <div className="w-6 h-6 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
