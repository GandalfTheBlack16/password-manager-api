import { type Request, type Response } from 'express'
import { type IExpressController } from '../../../../shared/infrastructure/http/IExpressController.js'
import { type VaultFinder } from '../../../application/VaultFinder.js'
import { logger } from '../../../../shared/infrastructure/logger/Logger.js'
import { VaultFinderException } from '../../../application/exeptions/VaultFinderException.js'

export class FindVaultsController implements IExpressController {
  constructor (
    private readonly vaultFinder: VaultFinder
  ) {}

  async handleRequest (req: Request, res: Response) {
    try {
      const { userId } = req.query
      if (!userId) {
        logger.error({ name: 'user-service' }, 'Error fetching vault list: User id is not specified')
        return res.status(400).json({
          status: 'Error',
          message: 'UserId should be specified as query param'
        })
      }
      const vaultList = await this.vaultFinder.run(userId as string)
      return res.status(200).json({
        status: 'Success',
        vaults: vaultList.map(item => {
          const credentials = item.getCredentials.map(credential => {
            const { getId: id, getName: name, getSecret: secret, getDescription: description } = credential
            return { id, name, secret, description }
          })
          return { ...item, id: item.getId, credentials }
        })
      })
    } catch (error) {
      if (error instanceof VaultFinderException) {
        return res.status(500).json({
          status: 'Error',
          message: `Error fetching vaults for user ${error.getOwner}`
        })
      }
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error'
      })
    }
  }
}
