import { VaultCreator } from '../application/VaultCreator.js'
import { MongoVaultRepository } from './db/repositories/MongoVaultRepository.js'

const vaultRepository = new MongoVaultRepository()

const vaultCreator = new VaultCreator(vaultRepository)

export {
  vaultCreator
}
