import express from 'express'
import { createUserController, findUsersController, loginController, findUserVaultsController } from '../dependencies.js'
import { jtwAthentication } from './middlewares/JwtAuthentication.js'

const userRouter = express.Router()

userRouter.get('/', jtwAthentication, findUsersController.handleRequest.bind(findUsersController))

userRouter.post('/', createUserController.handleRequest.bind(createUserController))

userRouter.post('/login', loginController.handleRequest.bind(loginController))

userRouter.get('/vaults', jtwAthentication, findUserVaultsController.handleRequest.bind(findUserVaultsController))

export { userRouter }
