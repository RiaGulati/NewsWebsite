export interface Article {
  _id: string
  title: string
  description: string
  content: string
  url: string
  urlToImage: string
  source: string
  author: string
  category: string
  publishedAt: string
}

export interface ArticlesResponse {
  articles: Article[]
  totalPages: number
  currentPage: number
  totalCount: number
}
