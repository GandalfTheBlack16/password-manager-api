import { VaultCreator } from '../application/VaultCreator.js'
import { VaultCredentialUpdater } from '../application/VaultCredentialUpdater.js'
import { VaultFinder } from '../application/VaultFinder.js'
import { MongoVaultRepository } from './db/repositories/MongoVaultRepository.js'

const vaultRepository = new MongoVaultRepository()

const vaultCreator = new VaultCreator(vaultRepository)
const vaultFinder = new VaultFinder(vaultRepository)
const vaultCredentialUpdater = new VaultCredentialUpdater(vaultRepository)

export {
  vaultCreator,
  vaultFinder,
  vaultCredentialUpdater
}
