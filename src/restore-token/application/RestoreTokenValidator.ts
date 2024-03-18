import { type RestoreToken } from '../domain/RestoreToken.js'
import { type RestoreTokenRepository } from '../domain/repositories/RestoreTokenRepository.js'
import { TokenValidationException } from './exceptions/TokenValidationException.js'

export class RestoreTokenValidator {
  constructor (
    private readonly restoreTokenRepository: RestoreTokenRepository
  ) {}

  async run (tokenId: string): Promise<RestoreToken> {
    try {
      const token = await this.restoreTokenRepository.findTokenById(tokenId)
      if (!token) {
        throw new TokenValidationException('Invalid restore token provided', tokenId)
      }
      const { isEnabled, getExpireAt } = token
      if (!isEnabled) {
        throw new TokenValidationException('Token has been already used', tokenId)
      }
      if (new Date() > getExpireAt) {
        throw new TokenValidationException('Token is expired', tokenId)
      }
      token.isEnabled = false
      const updatedToken = await this.restoreTokenRepository.updateTokenById(tokenId, token)
      if (!updatedToken) {
        throw Error('Could not update token details')
      }
      return updatedToken
    } catch (error) {
      if (error instanceof TokenValidationException) {
        throw error
      }
      throw new Error(`Unexpected error validating restore token: ${(error as Error).message}`)
    }
  }
}
