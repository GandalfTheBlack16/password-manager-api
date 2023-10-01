import { type Request, type Response } from 'express'
import { type IExpressController } from '../../../../shared/infrastructure/http/IExpressController.js'
import { type UserLogin } from '../../../application/UserLogin.js'

export class LoginController implements IExpressController {
  constructor (private readonly userLoger: UserLogin) {}

  async handleRequest (req: Request, res: Response) {
    const { username, email, password } = req.body
    if (!username && !email) {
      return res.status(400).json({
        status: 'Error',
        message: 'Not Username nor email provided'
      })
    }
    if (!password) {
      return res.status(400).json({
        status: 'Error',
        message: 'Password is not provided'
      })
    }
    const user = await this.userLoger.run({ username, email, password })
    console.log(user)
    return res.json(user)
  }
}
