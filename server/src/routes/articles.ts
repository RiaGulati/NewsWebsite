import { Router, Request, Response } from 'express'
import mongoose from 'mongoose'
import Article from '../models/Article'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, q } = req.query
    const page  = Math.max(1, parseInt(req.query.page  as string) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20))

    const filter: Record<string, unknown> = {}
    if (category) filter.category = category
    if (q)        filter.$text = { $search: q as string }

    const [articles, totalCount] = await Promise.all([
      Article.find(filter).sort({ publishedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Article.countDocuments(filter),
    ])

    res.json({ articles, totalPages: Math.ceil(totalCount / limit), currentPage: page, totalCount })
  } catch {
    res.status(500).json({ error: 'Failed to fetch articles' })
  }
})

router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await Article.distinct('category')
    res.json(categories)
  } catch {
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).json({ error: 'Article not found' }); return
    }
    const article = await Article.findById(req.params.id).lean()
    if (!article) { res.status(404).json({ error: 'Article not found' }); return }
    res.json(article)
  } catch {
    res.status(500).json({ error: 'Failed to fetch article' })
  }
})

export default router
