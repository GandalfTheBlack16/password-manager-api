import { type Request, type Response } from 'express'
import { type IExpressController } from '../../../../shared/infrastructure/http/IExpressController.js'
import { UserDoesNotExistsException } from '../../../application/exception/UserDoesNotExistsException.js'
import { type UserEraser } from '../../../application/UserEraser.js'
import { type VaultEraser } from '../../../../vault/application/VaultEraser.js'
import { VaultDeletionException } from '../../../../vault/application/exceptions/VaultDeletionException.js'

export class DeleteUserController implements IExpressController {
  constructor (
    private readonly userEraser: UserEraser,
    private readonly vaultEraser: VaultEraser
  ) {}

  async handleRequest (req: Request, res: Response) {
    try {
      const { userId } = req.query
      if (!userId) {
        return res.status(400).json({
          status: 'Error',
          message: 'Bad request, userId should be specified'
        })
      }
      await this.userEraser.run(userId as string)
      await this.vaultEraser.run({ userId: userId as string })
      return res.status(200).json({
        status: 'Success',
        message: `User ${userId as string} deleted succesfully`
      })
    } catch (error) {
      if (error instanceof UserDoesNotExistsException) {
        return res.status(404).json({
          status: 'Error',
          message: `User with id ${error.userId} does not exists`
        })
      }
      if (error instanceof VaultDeletionException) {
        return res.status(200).json({
          status: 'Warning',
          message: 'User deleted succesfully but its vaults cannot be cleaned. Manual operation should be required'
        })
      }
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error'
      })
    }
  }
}
