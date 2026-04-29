export interface Article {
  id: string
  title: string
  description: string
  content: string
  url: string
  urlToImage: string
  source: string
  author: string
  category: string
  publishedAt: Date
  fetchedAt: Date
}

export interface User {
  id: string
  email: string
  subscriptionToken: string
  categories: string[]
  verified: boolean
  createdAt: Date
}

export interface SavedArticle {
  id: string
  userId: string
  articleId: string
  savedAt: Date
}
