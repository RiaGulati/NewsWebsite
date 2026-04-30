import mongoose, { Schema, Document, Types } from 'mongoose'

export interface ISource {
  name: string
  url: string
  articleId: Types.ObjectId
}

export interface ITopic extends Document {
  name: string
  category: string
  briefing: string
  sources: ISource[]
  articleIds: Types.ObjectId[]
  createdAt: Date
}

const SourceSchema = new Schema<ISource>(
  {
    name:      { type: String, required: true },
    url:       { type: String, required: true },
    articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
  },
  { _id: false }
)

const TopicSchema = new Schema<ITopic>({
  name:       { type: String, required: true },
  category:   { type: String, required: true, index: true },
  briefing:   { type: String, required: true },
  sources:    [SourceSchema],
  articleIds: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
  createdAt:  { type: Date, default: Date.now },
})

export default mongoose.model<ITopic>('Topic', TopicSchema)
