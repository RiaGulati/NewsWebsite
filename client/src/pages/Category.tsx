import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getTopics } from '../lib/api'
import TopicCard from '../components/TopicCard'
import type { Topic } from '../types/topic'

export default function Category() {
  const { name } = useParams<{ name: string }>()
  const [topics, setTopics] = useState<Topic[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!name) return
    setLoading(true)
    getTopics({ category: name, page })
      .then((data) => {
        setTopics((prev) => (page === 1 ? data.topics : [...prev, ...data.topics]))
        setTotalPages(data.totalPages)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [name, page])

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 capitalize">{name}</h1>

      {loading && topics.length === 0 ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
      ) : topics.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No topics in this category.</p>
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
            className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm hover:bg-gray-700 transition-colors"
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
