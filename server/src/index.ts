import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import articlesRouter from './routes/articles'
import topicsRouter from './routes/topics'
import usersRouter from './routes/users'
import { fetchAndStoreArticles } from './jobs/fetchArticles'
import { clusterAllCategories } from './jobs/clusterTopics'

dotenv.config()
// requires ANTHROPIC_API_KEY in .env

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: /^http:\/\/localhost:\d+$/, })) 
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/articles', articlesRouter)
app.use('/api/topics', topicsRouter)
app.use('/api/users', usersRouter)

app.post('/api/admin/fetch-now', async (_req, res) => {
  await fetchAndStoreArticles()
  res.json({ message: 'done' })
})

app.post('/api/admin/cluster-now', async (_req, res) => {
  await clusterAllCategories()
  res.json({ message: 'done' })
})

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err)
    process.exit(1)
  })
