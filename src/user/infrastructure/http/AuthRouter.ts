import express from 'express'
import { createUserController, loginController, sendPasswordRestoreController } from '../dependencies.js'

const authRouter = express.Router()

authRouter.post('/signup', createUserController.handleRequest.bind(createUserController))

authRouter.post('/login', loginController.handleRequest.bind(loginController))

authRouter.post('/restore-password', sendPasswordRestoreController.handleRequest.bind(sendPasswordRestoreController))

export { authRouter }
