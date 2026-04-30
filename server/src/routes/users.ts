import { Router, Request, Response } from 'express'
import User from '../models/User'

const router = Router()

router.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const { email, categories } = req.body

    if (!email || !Array.isArray(categories) || categories.length === 0) {
      res.status(400).json({ error: 'email and a non-empty categories array are required' }); return
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { categories } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    res.json({ message: 'subscribed', user })
  } catch {
    res.status(500).json({ error: 'Failed to subscribe' })
  }
})

export default router
