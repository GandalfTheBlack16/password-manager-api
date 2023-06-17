import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
  _id: {
    type: String,
    default: Schema.Types.UUID
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

export const UserModel = model('User', UserSchema)
