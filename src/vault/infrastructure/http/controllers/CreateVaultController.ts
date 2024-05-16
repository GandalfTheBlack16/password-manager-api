import { type Request, type Response } from 'express'
import { type IExpressController } from '../../../../shared/infrastructure/http/IExpressController.js'
import { type VaultCreator } from '../../../application/VaultCreator.js'
import { logger } from '../../../../shared/infrastructure/logger/Logger.js'
import { VaultCreationException } from '../../../application/exceptions/VaultCreationException.js'

export class CreateVaultController implements IExpressController {
  constructor (
    private readonly vaultCreator: VaultCreator
  ) {}

  async handleRequest (req: Request, res: Response) {
    const { userId } = req.query
    const { name } = req.body
    if (!userId) {
      logger.error({ name: 'create-vault-controller' }, 'Error creating a vault: User id is not specified')
      return res.status(400).json({
        status: 'Error',
        message: 'UserId should be specified as query param'
      })
    }
    try {
      const {
        getId: id,
        getOwner: owner,
        getName: vaultName,
        getLastModified: lastModified,
        getCredentials: credentials
      } = await this.vaultCreator.run(userId as string, name as string)
      return res.status(201).json({
        status: 'Success',
        message: 'Vault created succesfully',
        vault: { id, owner, vaultName, lastModified, credentials }
      })
    } catch (error) {
      if (error instanceof VaultCreationException) {
        return res.status(500).json({
          status: 'Error',
          message: `Error creating a new vault for user ${error.getOwner}`
        })
      }
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error'
      })
    }
  }
}
