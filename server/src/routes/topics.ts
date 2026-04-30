import { Router, Request, Response } from 'express'
import mongoose from 'mongoose'
import Topic from '../models/Topic'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page  as string) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20))

    const filter: Record<string, unknown> = {}
    if (req.query.category) filter.category = req.query.category
    ;(filter as any)['sources.1'] = { $exists: true }

    const [topics, totalCount] = await Promise.all([
      Topic.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Topic.countDocuments(filter),
    ])

    res.json({ topics, totalPages: Math.ceil(totalCount / limit), currentPage: page, totalCount })
  } catch {
    res.status(500).json({ error: 'Failed to fetch topics' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).json({ error: 'Topic not found' }); return
    }
    const topic = await Topic.findById(req.params.id).populate('articleIds').lean()
    if (!topic) { res.status(404).json({ error: 'Topic not found' }); return }
    res.json(topic)
  } catch {
    res.status(500).json({ error: 'Failed to fetch topic' })
  }
})

export default router
