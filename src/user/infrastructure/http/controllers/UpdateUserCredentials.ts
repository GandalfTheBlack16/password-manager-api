import { type Request, type Response } from 'express'
import { type IExpressController } from '../../../../shared/infrastructure/http/IExpressController.js'
import { type VaultCredentialUpdater } from '../../../../vault/application/VaultCredentialUpdater.js'

export class UpdateUserCredentials implements IExpressController {
  constructor (
    private readonly vaultCredentialUpdater: VaultCredentialUpdater
  ) {}

  async handleRequest (req: Request, res: Response) {
    try {
      const { vaultId } = req.params
      const { credentials } = req.body
      const vault = await this.vaultCredentialUpdater.run({ vaultId, credentials })
      if (!vault) {
        return res.status(404).json({
          status: 'Error',
          message: 'Vault does not exist'
        })
      }
      return res.status(200).json({
        status: 'Success',
        message: 'Vault updated',
        vault: {
          owner: vault.getOwner,
          credentials: vault.getCredentials.map(credential => {
            const { getId: id, getName: name, getSecret: secret, getDescription: description } = credential
            return { id, name, secret, description }
          })
        }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error'
      })
    }
  }
}
