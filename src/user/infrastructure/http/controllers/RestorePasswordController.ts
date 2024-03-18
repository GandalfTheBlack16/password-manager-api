import { type Request, type Response } from 'express'
import { type IExpressController } from '../../../../shared/infrastructure/http/IExpressController.js'
import { type RestoreTokenValidator } from '../../../../restore-token/application/RestoreTokenValidator.js'
import { TokenValidationException } from '../../../../restore-token/application/exceptions/TokenValidationException.js'
import { logger } from '../../../../shared/infrastructure/logger/Logger.js'
import { type UserPasswordUpdater } from '../../../application/UserPasswordUpdater.js'
import { UserDoesNotExistsException } from '../../../application/exception/UserDoesNotExistsException.js'

export class RestorePasswordController implements IExpressController {
  constructor (
    private readonly restoreTokenValidator: RestoreTokenValidator,
    private readonly userPasswordUpdated: UserPasswordUpdater
  ) {}

  async handleRequest (req: Request, res: Response) {
    const { token } = req.params
    const { password } = req.body
    if (!token) {
      return res.status(400).json({
        status: 'Bad request',
        message: 'A valid token should be provided as Url param'
      })
    }
    if (!password) {
      return res.status(400).json({
        status: 'Bad request',
        message: 'Fields \'password\' should be provided within body request'
      })
    }
    try {
      const { getUserId: userId } = await this.restoreTokenValidator.run(token)
      await this.userPasswordUpdated.run({ userId, newPassword: password })
      return res.status(200).json({
        status: 'Success',
        message: 'Password updated'
      })
    } catch (err) {
      if (err instanceof TokenValidationException) {
        return res.status(400).json({
          status: 'Bad request',
          message: err.message
        })
      }
      if (err instanceof UserDoesNotExistsException) {
        return res.status(500).json({
          status: 'Internal server error',
          message: 'User has been blocked or not exists'
        })
      }
      logger.error({ name: 'restore-password' }, (err as Error).message)
      return res.status(500).json({
        status: 'Internal server error',
        message: 'Could not update password'
      })
    }
  }
}
