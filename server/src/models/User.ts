import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  categories: string[]
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  email:      { type: String, required: true, unique: true, lowercase: true },
  categories: [{ type: String }],
  createdAt:  { type: Date, default: Date.now },
})

export default mongoose.model<IUser>('User', UserSchema)
