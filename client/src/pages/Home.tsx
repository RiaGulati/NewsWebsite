import { useState, useEffect } from 'react'
import { getTopics, getCategories } from '../lib/api'
import TopicCard from '../components/TopicCard'
import type { Topic } from '../types/topic'

export default function Home() {
  const [topics, setTopics] = useState<Topic[]>([])
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
    getTopics({ category: activeCategory, page })
      .then((data) => {
        setTopics((prev) => (page === 1 ? data.topics : [...prev, ...data.topics]))
        setTotalPages(data.totalPages)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activeCategory, page])

  function selectCategory(cat: string | undefined) {
    setActiveCategory(cat)
    setPage(1)
    setTopics([])
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">NewsWire</h1>
        <p className="text-gray-500 mt-1">Multi-source coverage on today's biggest stories</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => selectCategory(undefined)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeCategory === undefined
              ? 'bg-green-600 text-white'
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
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && topics.length === 0 ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
      ) : topics.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No topics found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topics.map((topic) => (
            <TopicCard key={topic._id} topic={topic} />
          ))}
        </div>
      )}

      {page < totalPages && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-2 bg-green-600 text-white rounded-full text-sm hover:bg-green-700 transition-colors"
          >
            Load more
          </button>
        </div>
      )}

      {loading && topics.length > 0 && (
        <div className="flex justify-center mt-8">
          <div className="w-6 h-6 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
