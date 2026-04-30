import Article from '../models/Article'
import Topic from '../models/Topic'

const STOP_WORDS = new Set([
  'the','a','an','is','are','was','were','be','been','has','have','had','will',
  'would','could','should','may','might','for','of','to','in','on','at','by',
  'with','from','that','this','these','those','and','or','but','not','it','its',
  'he','she','they','we','you','i','as','an','up','out','about','over','after',
  'into','than','then','when','where','who','which','how','new','says','say','said',
])

function extractKeywords(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length >= 4 && !STOP_WORDS.has(w))
  )
}

function countSharedKeywords(a: Set<string>, b: Set<string>): number {
  let count = 0
  for (const kw of a) if (b.has(kw)) count++
  return count
}

function buildBriefing(descriptions: (string | undefined)[], fallback: string): string {
  const sentences: string[] = []
  for (const desc of descriptions) {
    if (!desc) continue
    const first = desc.split('. ')[0].trim()
    if (first.length >= 40 && first.length <= 150 && first !== fallback) {
      sentences.push(first)
    }
    if (sentences.length === 3) break
  }
  return sentences.length > 0 ? sentences.join(' ') : fallback
}

function topKeywords(keywordSets: Set<string>[]): string {
  const freq = new Map<string, number>()
  for (const kws of keywordSets)
    for (const kw of kws) freq.set(kw, (freq.get(kw) ?? 0) + 1)

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([kw]) => kw.charAt(0).toUpperCase() + kw.slice(1))
    .join(' ')
}

export async function clusterArticlesByCategory(category: string): Promise<void> {
  const articles = await Article.find({ category })
    .select('title description url source _id')
    .limit(100)
    .lean()

  if (articles.length < 3) return

  const keywords = articles.map((a) => extractKeywords(a.title))

  const matchCounts = articles.map((_, i) =>
    articles.reduce((sum, __, j) => (i !== j ? sum + countSharedKeywords(keywords[i], keywords[j]) : sum), 0)
  )

  const clustered = new Array(articles.length).fill(false)
  const clusters: number[][] = []

  const order = [...matchCounts.keys()].sort((a, b) => matchCounts[b] - matchCounts[a])

  for (const seed of order) {
    if (clustered[seed]) continue

    const group = [seed]
    clustered[seed] = true

    for (let j = 0; j < articles.length; j++) {
      if (clustered[j]) continue
      if (countSharedKeywords(keywords[seed], keywords[j]) >= 1) {
        group.push(j)
        clustered[j] = true
      }
    }

    clusters.push(group)
  }

  for (let ci = clusters.length - 1; ci >= 0; ci--) {
    if (clusters[ci].length >= 2) continue
    const small = clusters[ci]
    let bestClusterIdx = -1
    let bestScore = 0
    for (let li = 0; li < clusters.length; li++) {
      if (li === ci) continue
      const largeSeed = clusters[li][0]
      let score = 0
      for (const si of small) score += countSharedKeywords(keywords[largeSeed], keywords[si])
      if (score > bestScore) {
        bestScore = score
        bestClusterIdx = li
      }
    }
    if (bestClusterIdx !== -1) {
      clusters[bestClusterIdx].push(...small)
      clusters.splice(ci, 1)
    }
  }

  const newTopics = clusters.map((indices) => {
    const clusterArticles = indices.map((i) => articles[i])
    const clusterKeywords = indices.map((i) => keywords[i])
    const raw = clusterArticles[0].title.replace(/[-|–].*$/, '').trim()
    const lastSpace = raw.slice(0, 70).lastIndexOf(' ')
    const name = raw.length <= 70 ? raw : (lastSpace > 0 ? raw.slice(0, lastSpace) : raw.slice(0, 70)) + '...'

    return {
      name,
      category,
      briefing: buildBriefing(clusterArticles.map((a) => a.description), topKeywords(clusterKeywords)),
      sources: clusterArticles.map((a) => ({ name: a.source, url: a.url, articleId: a._id })),
      articleIds: clusterArticles.map((a) => a._id),
    }
  })

  await Topic.deleteMany({ category })
  await Topic.insertMany(newTopics)

  console.log(`[${category}] ${newTopics.length} topics created`)
}
