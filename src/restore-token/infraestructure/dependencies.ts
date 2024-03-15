import { RestoreTokenCreator } from '../application/ResotreTokenCreator.js'
import { MongoRestoreTokenRepository } from './db/repositories/MongoRestoreTokenRepository.js'

const restoreTokenRepository = new MongoRestoreTokenRepository()

const restoreTokenCreator = new RestoreTokenCreator(restoreTokenRepository)

export {
  restoreTokenCreator
}
