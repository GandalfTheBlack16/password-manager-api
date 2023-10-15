import { type Request, type Response } from 'express'
import { type IExpressController } from '../../../../shared/infrastructure/http/IExpressController.js'
import { type UserPasswordUpdater } from '../../../application/UserPasswordUpdater.js'
import { UserDoesNotExistsException } from '../../../application/exception/UserDoesNotExistsException.js'
import { UserPasswordNotMatchException } from '../../../application/exception/UserPasswordNotMatchException.js'

export class ChangeUserPasswordController implements IExpressController {
  constructor (
    private readonly userPasswordUpdater: UserPasswordUpdater
  ) {}

  async handleRequest (req: Request, res: Response) {
    const { userId } = req.query
    if (!userId) {
      return res.status(400).json({
        status: 'Error',
        message: 'Bad request, userId must be specified as query param'
      })
    }
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        status: 'Error',
        message: 'Bad request, old and new passwords must be specified as body param'
      })
    }
    try {
      const user = await this.userPasswordUpdater.run({ userId: userId as string, oldPassword, newPassword })
      if (!user) {
        return res.status(500).json({
          status: 'Error',
          message: 'There was an error changing user password'
        })
      }
      return res.status(200).json({
        status: 'Success',
        message: 'Password updated succesfully',
        user: {
          id: user.getId,
          username: user.getUsername
        }
      })
    } catch (error) {
      if (error instanceof UserDoesNotExistsException) {
        return res.status(404).json({
          status: 'Error',
          message: `User with id ${error.userId} does not exists`
        })
      }
      if (error instanceof UserPasswordNotMatchException) {
        return res.status(401).json({
          status: 'Error',
          message: 'Current password does not match'
        })
      }
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error'
      })
    }
  }
}
