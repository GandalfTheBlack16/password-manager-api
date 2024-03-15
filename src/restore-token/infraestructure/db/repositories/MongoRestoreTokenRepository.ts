import { type RestoreToken } from '../../../domain/RestoreToken.js'
import { type RestoreTokenRepository } from '../../../domain/repositories/RestoreTokenRepository.js'
import { RestoreTokenModel } from '../models/RestoreTokenModel.js'

export class MongoRestoreTokenRepository implements RestoreTokenRepository {
  async insertToken (token: RestoreToken): Promise<RestoreToken | null> {
    const tokenModel = new RestoreTokenModel({
      _id: token.getId,
      token: token.getValue,
      userId: token.getUserId,
      expireAt: token.getExpireAt,
      enable: token.isEnabled
    })
    await tokenModel.save()
    return token
  }

  async findTokenById (tokenId: string): Promise<RestoreToken | null> {
    return null
  }

  async updateTokenById (tokenId: string, token: RestoreToken): Promise<RestoreToken | null> {
    return null
  }
}
