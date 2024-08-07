import { Schema, model } from 'mongoose'

const RestoreTokenSchema = new Schema({
  _id: {
    type: String,
    default: Schema.Types.UUID
  },
  token: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  expireAt: {
    type: Date,
    required: true
  },
  enable: {
    type: Boolean,
    required: true
  }
}, { collection: 'restoreTokens' })

export const RestoreTokenModel = model('RestoreToken', RestoreTokenSchema)
