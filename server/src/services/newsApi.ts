import axios from 'axios'

const BASE_URL = 'https://newsapi.org/v2'

interface NewsApiArticle {
  title: string
  description: string | null
  content: string | null
  url: string
  urlToImage: string | null
  source: { id: string | null; name: string }
  author: string | null
  publishedAt: string
}

interface NewsApiResponse {
  status: string
  articles: NewsApiArticle[]
}

export async function fetchTopHeadlines(category: string) {
  try {
    const { data } = await axios.get<NewsApiResponse>(`${BASE_URL}/top-headlines`, {
      params: { country: 'us', category, pageSize: 100, apiKey: process.env.NEWS_API_KEY },
    })

    return data.articles
      .filter((a) => a.url && a.title)
      .map((a) => ({
        title:       a.title,
        description: a.description ?? undefined,
        content:     a.content ?? undefined,
        url:         a.url,
        urlToImage:  a.urlToImage ?? undefined,
        source:      a.source.name,
        author:      a.author ?? undefined,
        category,
        publishedAt: new Date(a.publishedAt),
        fetchedAt:   new Date(),
      }))
  } catch (err) {
    console.error(`fetchTopHeadlines error for category "${category}":`, err)
    return []
  }
}
