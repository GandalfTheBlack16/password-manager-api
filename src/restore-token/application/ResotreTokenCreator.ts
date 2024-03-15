import { randomBytes } from 'crypto'
import { RestoreToken } from '../domain/RestoreToken.js'
import { type RestoreTokenRepository } from '../domain/repositories/RestoreTokenRepository.js'
import { v4 as UUID } from 'uuid'

export class RestoreTokenCreator {
  constructor (
    private readonly tokenRespository: RestoreTokenRepository
  ) {}

  async run (userId: string) {
    const token = new RestoreToken(
      UUID(),
      randomBytes(16).toString('hex'),
      userId
    )
    return await this.tokenRespository.insertToken(token)
  }
}
