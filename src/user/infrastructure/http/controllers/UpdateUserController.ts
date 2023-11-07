import { type Request, type Response } from 'express'
import { type IExpressController } from '../../../../shared/infrastructure/http/IExpressController.js'
import { type UserUpdater } from '../../../application/UserUpdater.js'
import { UserDoesNotExistsException } from '../../../application/exception/UserDoesNotExistsException.js'

export class UpdateUserController implements IExpressController {
  constructor (
    private readonly userUpdater: UserUpdater
  ) {}

  async handleRequest (req: Request, res: Response) {
    const { userId: id } = req.params
    const { user: { username, email } }: { user: { username?: string, email?: string } } = req.body
    if (!id) {
      return res.status(400).json({
        status: 'Error',
        message: 'Bad request: User id should be specified as url param'
      })
    }
    if (!username && !email) {
      return res.status(400).json({
        status: 'Error',
        message: 'Bad request: User details to update should be specified in request payload'
      })
    }
    try {
      const updatedUser = await this.userUpdater.run({ id, username, email })
      if (!updatedUser) {
        return res.status(500).json({
          status: 'Error',
          message: 'Error updating user details'
        })
      }
      return res.status(200).json({
        status: 'Success',
        message: 'User details updated successfully',
        user: {
          username: username ?? updatedUser.getUsername,
          email: email ?? updatedUser.getEmail
        }
      })
    } catch (error) {
      if (error instanceof UserDoesNotExistsException) {
        return res.status(404).json({
          status: 'Error',
          message: `User with id ${error.userId} does not exists`
        })
      }
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error'
      })
    }
  }
}
