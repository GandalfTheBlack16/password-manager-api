import { RestoreTokenCreator } from '../application/RestoreTokenCreator.js'
import { RestoreTokenValidator } from '../application/RestoreTokenValidator.js'
import { MongoRestoreTokenRepository } from './db/repositories/MongoRestoreTokenRepository.js'

const restoreTokenRepository = new MongoRestoreTokenRepository()

const restoreTokenCreator = new RestoreTokenCreator(restoreTokenRepository)
const restoreTokenValidator = new RestoreTokenValidator(restoreTokenRepository)

export {
  restoreTokenCreator,
  restoreTokenValidator
}
