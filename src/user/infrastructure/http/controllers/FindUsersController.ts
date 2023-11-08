import { type Request, type Response } from 'express'
import { type IExpressController } from '../../../../shared/infrastructure/http/IExpressController.js'
import { type UserFinder } from '../../../application/UserFinder.js'
import { type FindUserDto } from '../../../application/user-types.js'

export class FindUserController implements IExpressController {
  constructor (private readonly userFinder: UserFinder) {}

  async handleRequest (req: Request, res: Response) {
    try {
      const { id, email, username }: FindUserDto = req.query
      const userList = await this.userFinder.run({ id, email, username })
      if (userList.length === 0) {
        let message = email ? `Email ${email} is available.` : ''
        message += username ? `Username ${username} is available` : ''
        return res
          .status(404)
          .json({
            status: 'Success',
            message: message ?? 'Without results'
          })
      }
      return res.json({
        status: 'Success',
        list: userList
      })
    } catch (error) {
      return res.json({
        status: 'Error',
        message: 'Internal server error'
      })
    }
  }
}
