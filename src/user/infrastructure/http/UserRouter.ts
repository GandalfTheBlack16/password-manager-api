import express from 'express'
import { deleteUserCredentialController, findUsersController, findUserVaultsController, updateUserCredentials } from '../dependencies.js'

const userRouter = express.Router()

userRouter.get('/', findUsersController.handleRequest.bind(findUsersController))

userRouter.get('/vaults', findUserVaultsController.handleRequest.bind(findUserVaultsController))

userRouter.put('/vaults/:vaultId/credentials', updateUserCredentials.handleRequest.bind(updateUserCredentials))

userRouter.delete('/vaults/:vaultId/credentials/:credentialId', deleteUserCredentialController.handleRequest.bind(deleteUserCredentialController))

export { userRouter }
