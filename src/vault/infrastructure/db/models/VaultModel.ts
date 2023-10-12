import { Schema, model } from 'mongoose'

const VaultSchema = new Schema({
  _id: {
    type: String
  },
  owner: {
    type: String,
    required: true
  },
  credentials: [
    {
      _id: false,
      name: {
        type: String
      },
      serviceName: {
        type: String,
        required: true
      },
      secret: {
        type: String,
        required: true
      }
    }
  ]
})

export const VaultModel = model('Vault', VaultSchema)
