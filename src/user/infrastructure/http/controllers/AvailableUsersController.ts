import { type Request, type Response } from 'express'
import { type IExpressController } from '../../../../shared/infrastructure/http/IExpressController.js'
import { type UserFinder } from '../../../application/UserFinder.js'
import { type FindUserDto } from '../../../application/user-types.js'

export class AvailableUserController implements IExpressController {
  constructor (private readonly userFinder: UserFinder) {}

  async handleRequest (req: Request, res: Response) {
    try {
      const { id, email, username }: FindUserDto = req.query
      if (!email && !username) {
        return res.status(400).json({
          status: 'Error',
          message: 'Bad request: "username" or "email" should be specified as query params'
        })
      }
      const userList = await this.userFinder.run({ id, email, username })
      if (userList.length === 0) {
        let message = email ? `Email address ${email} is available to use. ` : ''
        message += username ? `Username ${username} is available to use.` : ''
        return res.json({
          status: 'Success',
          message,
          available: true
        })
      }
      let message = email ? `Email address ${email} is not available to use. ` : ''
      message += username ? `Username ${username} is not available to use.` : ''
      return res.json({
        status: 'Success',
        message,
        available: false
      })
    } catch (error) {
      return res.json({
        status: 'Error',
        message: 'Internal server error'
      })
    }
  }
}
