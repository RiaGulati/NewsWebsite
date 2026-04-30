import type { Article, ArticlesResponse } from '../types/article'
import type { TopicsResponse } from '../types/topic'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export async function getArticles(params: {
  category?: string
  q?: string
  page?: number
  limit?: number
}): Promise<ArticlesResponse> {
  const query = new URLSearchParams()
  if (params.category) query.set('category', params.category)
  if (params.q) query.set('q', params.q)
  if (params.page !== undefined) query.set('page', String(params.page))
  if (params.limit !== undefined) query.set('limit', String(params.limit))
  const res = await fetch(`${BASE_URL}/api/articles?${query}`)
  if (!res.ok) throw new Error('Failed to fetch articles')
  return res.json()
}

export async function getCategories(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/api/articles/categories`)
  if (!res.ok) throw new Error('Failed to fetch categories')
  return res.json()
}

export async function getArticleById(id: string): Promise<Article> {
  const res = await fetch(`${BASE_URL}/api/articles/${id}`)
  if (!res.ok) throw new Error('Failed to fetch article')
  return res.json()
}

export async function getTopics(params: {
  category?: string
  page?: number
  limit?: number
}): Promise<TopicsResponse> {
  const query = new URLSearchParams()
  if (params.category) query.set('category', params.category)
  if (params.page !== undefined) query.set('page', String(params.page))
  if (params.limit !== undefined) query.set('limit', String(params.limit))
  const res = await fetch(`${BASE_URL}/api/topics?${query}`)
  if (!res.ok) throw new Error('Failed to fetch topics')
  return res.json()
}

export async function subscribeUser(email: string, categories: string[]): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/api/users/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, categories }),
  })
  if (!res.ok) throw new Error('Failed to subscribe')
  return res.json()
}
