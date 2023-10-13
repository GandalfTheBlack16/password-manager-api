import { Schema, model } from 'mongoose'

const VaultSchema = new Schema({
  _id: {
    type: String
  },
  owner: {
    type: String,
    required: true
  },
  lastModified: {
    type: Date
  },
  credentials: [
    {
      _id: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      secret: {
        type: String,
        required: true
      },
      description: {
        type: String
      }
    }
  ]
})

export const VaultModel = model('Vault', VaultSchema)
