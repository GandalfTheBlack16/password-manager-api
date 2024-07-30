import { type Request, type Response } from 'express'
import { type IExpressController } from '../../../../shared/infrastructure/http/IExpressController.js'
import { type UserLogin } from '../../../application/UserLogin.js'

export class LoginController implements IExpressController {
  constructor (private readonly userLoger: UserLogin) {}

  async handleRequest (req: Request, res: Response) {
    const { username, email, password, keepLoggedIn } = req.body
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
    if (typeof keepLoggedIn !== 'boolean') {
      return res.status(400).json({
        status: 'Error',
        message: 'Field \'keepLoggedIn\' should be boolean'
      })
    }
    const response = await this.userLoger.run({ username, email, password, keepLoggedIn })
    const status = response?.status === 'Unauthorized' ? 401 : 200
    return res.status(status).json(response)
  }
}
