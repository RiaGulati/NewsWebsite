import mongoose, { Schema, Document } from 'mongoose'

export interface IArticle extends Document {
  title: string
  description?: string
  content?: string
  url: string
  urlToImage?: string
  source: string
  author?: string
  category: string
  publishedAt: Date
  fetchedAt: Date
}

const ArticleSchema = new Schema<IArticle>({
  title:       { type: String, required: true },
  description: { type: String },
  content:     { type: String },
  url:         { type: String, required: true, unique: true },
  urlToImage:  { type: String },
  source:      { type: String, required: true },
  author:      { type: String },
  category:    { type: String, required: true, index: true },
  publishedAt: { type: Date,   required: true, index: true },
  fetchedAt:   { type: Date,   default: Date.now },
})

ArticleSchema.index({ title: 'text', description: 'text' })

export default mongoose.model<IArticle>('Article', ArticleSchema)
