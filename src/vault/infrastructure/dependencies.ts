import { VaultCreator } from '../application/VaultCreator.js'
import { VaultCredentialEraser } from '../application/VaultCredentialEraser.js'
import { VaultCredentialUpdater } from '../application/VaultCredentialUpdater.js'
import { VaultFinder } from '../application/VaultFinder.js'
import { MongoVaultRepository } from './db/repositories/MongoVaultRepository.js'
import { DeleteCredentialController } from './http/controllers/DeleteCredentialController.js'
import { FindVaultsController } from './http/controllers/FindVaultsController.js'
import { UpdateCredentialsController } from './http/controllers/UpdateCredentialsController.js'

const vaultRepository = new MongoVaultRepository()

const vaultCreator = new VaultCreator(vaultRepository)
const vaultFinder = new VaultFinder(vaultRepository)
const vaultCredentialUpdater = new VaultCredentialUpdater(vaultRepository)
const vaultCredentialEraser = new VaultCredentialEraser(vaultRepository)

const findVaultsController = new FindVaultsController(vaultFinder)
const updateCredentialsController = new UpdateCredentialsController(vaultCredentialUpdater)
const deleteCredentialController = new DeleteCredentialController(vaultCredentialEraser)

export {
  vaultCreator,
  findVaultsController,
  updateCredentialsController,
  deleteCredentialController
}
