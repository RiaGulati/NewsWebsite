import { clusterArticlesByCategory } from '../services/clustering'

const CATEGORIES = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology']

export async function clusterAllCategories(): Promise<void> {
  for (const category of CATEGORIES) {
    await clusterArticlesByCategory(category)
  }
}
