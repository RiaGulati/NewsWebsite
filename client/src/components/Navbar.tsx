import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <nav className="bg-black text-white px-6 py-3 flex items-center gap-4">
      <Link to="/" className="text-xl font-bold tracking-tight shrink-0 text-green-400">
        NewsWire
      </Link>
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search news..."
          className="w-full max-w-md bg-zinc-900 text-white placeholder-gray-400 px-4 py-1.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <Link to="/subscribe" className="shrink-0 text-sm text-green-400 hover:text-green-300 transition-colors">
        Subscribe
      </Link>
    </nav>
  )
}
