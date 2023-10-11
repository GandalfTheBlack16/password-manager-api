import { type Request, type Response } from 'express'
import { type IExpressController } from '../../../../shared/infrastructure/http/IExpressController.js'
import { type UserCreator } from '../../../application/UserCreator.js'
import { IllegalArgException } from '../../../../shared/domain/exception/IllegalArgException.js'
import { UserAlreadyExistsException } from '../../../application/exception/UserAlreadyExistsException.js'
import { type VaultCreator } from '../../../../vault/application/VaultCreator.js'
import { VaultCreationException } from '../../../../vault/application/exeptions/VaultCreationException.js'

export class CreateUserController implements IExpressController {
  constructor (
    private readonly userCreator: UserCreator,
    private readonly vaultCreator: VaultCreator
  ) {}

  async handleRequest (req: Request, res: Response) {
    const { email, username, password } = req.body

    try {
      const user = await this.userCreator.run({ email, username, password })
      const vault = await this.vaultCreator.run(user.getUsername)
      return res.status(201).json({
        status: 'Success',
        message: 'User created successfully',
        user: {
          email: user.getEmail,
          username: user.getUsername,
          vaultId: vault.getId
        }
      })
    } catch (error) {
      if (error instanceof IllegalArgException) {
        return res.status(400).json({
          status: 'Validation error',
          message: error.getMessage
        })
      }
      if (error instanceof UserAlreadyExistsException) {
        return res.status(409).json({
          status: 'Error',
          message: 'User with that username/email already exists'
        })
      }
      if (error instanceof VaultCreationException) {
        return res.status(201).json({
          status: 'Warning',
          message: 'User created but there was an error creating a new Vault',
          user: error.getOwner
        })
      }

      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error'
      })
    }
  }
}
