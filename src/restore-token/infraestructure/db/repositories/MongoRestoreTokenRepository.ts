import { RestoreToken } from '../../../domain/RestoreToken.js'
import { type RestoreTokenRepository } from '../../../domain/repositories/RestoreTokenRepository.js'
import { RestoreTokenModel } from '../models/RestoreTokenModel.js'

export class MongoRestoreTokenRepository implements RestoreTokenRepository {
  async insertToken (token: RestoreToken): Promise<RestoreToken | null> {
    const tokenModel = new RestoreTokenModel({
      _id: token.getId,
      token: token.getValue,
      userId: token.getUserId,
      createdAt: token.getCreatedAt,
      expireAt: token.getExpireAt,
      enable: token.isEnabled
    })
    await tokenModel.save()
    return token
  }

  async findTokenById (tokenId: string): Promise<RestoreToken | null> {
    const document = await RestoreTokenModel.findOne({ token: tokenId })
    if (!document) {
      return null
    }
    const token = new RestoreToken(document._id, document.token, document.userId)
    token.isEnabled = document.enable
    token.getCreatedAt = document.createdAt
    token.getExpireAt = document.expireAt
    return token
  }

  async updateTokenById (tokenId: string, token: RestoreToken): Promise<RestoreToken | null> {
    const tokenModel = new RestoreTokenModel({
      _id: token.getId,
      token: token.getValue,
      userId: token.getUserId,
      createdAt: token.getCreatedAt,
      expireAt: token.getExpireAt,
      enable: token.isEnabled
    })
    const updated = await RestoreTokenModel.findOneAndUpdate({ token: tokenId }, { $set: tokenModel })
    if (!updated) {
      return null
    }
    return token
  }
}
