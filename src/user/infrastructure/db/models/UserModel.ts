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
  ,
  provider: {
    type: String,
    required: false
  },
  githubId: {
    type: String,
    required: false,
    unique: true,
    sparse: true
  },
  avatar: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: false
  }
})

export const UserModel = model('User', UserSchema)
