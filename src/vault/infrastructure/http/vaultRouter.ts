import express from 'express'
import { findVaultsController, updateCredentialsController, deleteCredentialController } from '../dependencies.js'

const vaultRouter = express.Router()

vaultRouter.get('/', findVaultsController.handleRequest.bind(findVaultsController))

vaultRouter.put('/:vaultId/credentials', updateCredentialsController.handleRequest.bind(updateCredentialsController))

vaultRouter.delete('/:vaultId/credentials/:credentialId', deleteCredentialController.handleRequest.bind(deleteCredentialController))

export { vaultRouter }
