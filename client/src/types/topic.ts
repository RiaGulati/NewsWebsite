export interface TopicSource {
  name: string
  url: string
  articleId: string
}

export interface Topic {
  _id: string
  name: string
  category: string
  briefing: string
  sources: TopicSource[]
  articleIds: string[]
  createdAt: string
}

export interface TopicsResponse {
  topics: Topic[]
  totalPages: number
  currentPage: number
  totalCount: number
}
