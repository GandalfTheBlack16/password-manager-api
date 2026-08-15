import express from 'express'
import { createUserController, loginController, restorePasswordController, sendPasswordRestoreController, gitHubCallbackController } from '../dependencies.js'

const authRouter = express.Router()

authRouter.post('/signup', createUserController.handleRequest.bind(createUserController))

authRouter.post('/login', loginController.handleRequest.bind(loginController))

authRouter.post('/auth/github/callback', gitHubCallbackController.handleRequest.bind(gitHubCallbackController))

authRouter.post('/restore-password', sendPasswordRestoreController.handleRequest.bind(sendPasswordRestoreController))

authRouter.put('/restore-password/:token', restorePasswordController.handleRequest.bind(restorePasswordController))

export { authRouter }
