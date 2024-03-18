import { type RestoreToken } from '../RestoreToken.js'

export interface RestoreTokenRepository {
  insertToken: (token: RestoreToken) => Promise<RestoreToken | null>
  findTokenById: (tokenId: string) => Promise<RestoreToken | null>
  updateTokenById: (tokenId: string, token: RestoreToken) => Promise<RestoreToken | null>
}
