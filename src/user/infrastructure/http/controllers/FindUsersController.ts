import { type Request, type Response } from 'express'
import { type IExpressController } from '../../../../shared/infrastructure/http/IExpressController.js'
import { type UserListFinder } from '../../../application/UserListFinder.js'

export class FindUserController implements IExpressController {
  constructor (private readonly userListFinder: UserListFinder) {}

  async handleRequest (req: Request, res: Response) {
    try {
      const userList = await this.userListFinder.run()
      return res.json({
        status: 'Succes',
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
