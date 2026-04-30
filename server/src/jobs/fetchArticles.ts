import Article from '../models/Article'
import { fetchTopHeadlines } from '../services/newsApi'

const CATEGORIES = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology']

export async function fetchAndStoreArticles() {
  for (const category of CATEGORIES) {
    const articles = await fetchTopHeadlines(category)
    let inserted = 0
    let skipped = 0

    for (const article of articles) {
      const result = await Article.updateOne(
        { url: article.url },
        { $setOnInsert: article },
        { upsert: true }
      )
      result.upsertedCount > 0 ? inserted++ : skipped++
    }

    console.log(`[${category}] inserted: ${inserted}, skipped: ${skipped}`)
  }
}
