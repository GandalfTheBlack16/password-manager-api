import express from 'express'
import { createUserController, loginController } from '../dependencies.js'

const authRouter = express.Router()

authRouter.post('/signup', createUserController.handleRequest.bind(createUserController))

authRouter.post('/login', loginController.handleRequest.bind(loginController))

export { authRouter }
