import { type Request, type Response } from 'express'
import { type IExpressController } from '../../../../shared/infrastructure/http/IExpressController.js'
import { type VaultEraser } from '../../../application/VaultEraser.js'
import { VaultNotExistsException } from '../../../application/exeptions/VaultNotExistsException.js'

export class DeleteVaultController implements IExpressController {
  constructor (
    private readonly vaultEraser: VaultEraser
  ) {}

  async handleRequest (req: Request, res: Response) {
    try {
      const { vaultId } = req.params
      if (!vaultId) {
        return res.status(400).json({
          status: 'Error',
          message: 'Bad request, vaultId must be specified as path variable'
        })
      }
      await this.vaultEraser.run(vaultId)
      return res.status(200).json({
        status: 'Success',
        message: `Vault ${vaultId} has been deleted`
      })
    } catch (error) {
      if (error instanceof VaultNotExistsException) {
        return res.status(404).json({
          status: 'Error',
          message: `Vault with id ${error.vaultId} does not exists`
        })
      }
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error'
      })
    }
  }
}
