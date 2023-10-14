import express from 'express'
import { findVaultsController, updateCredentialsController, deleteCredentialController, createVaultController, deleteVaultController } from '../dependencies.js'

const vaultRouter = express.Router()

vaultRouter.get('/', findVaultsController.handleRequest.bind(findVaultsController))

vaultRouter.put('/', createVaultController.handleRequest.bind(createVaultController))

vaultRouter.delete('/:vaultId', deleteVaultController.handleRequest.bind(deleteVaultController))

vaultRouter.put('/:vaultId/credentials', updateCredentialsController.handleRequest.bind(updateCredentialsController))

vaultRouter.delete('/:vaultId/credentials/:credentialId', deleteCredentialController.handleRequest.bind(deleteCredentialController))

export { vaultRouter }
