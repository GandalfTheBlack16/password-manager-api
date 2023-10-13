import { type Request, type Response } from 'express'
import { type IExpressController } from '../../../../shared/infrastructure/http/IExpressController.js'
import { type VaultCredentialEraser } from '../../../../vault/application/VaultCredentialEraser.js'
import { VaultNotExistsException } from '../../../../vault/application/exeptions/VaultNotExistsException.js'
import { CredentialNotExistsException } from '../../../../vault/application/exeptions/CredentialNotExistsException.js'

export class DeleteUserCredentialController implements IExpressController {
  constructor (
    private readonly vaultCredentialEraser: VaultCredentialEraser
  ) {}

  async handleRequest (req: Request, res: Response) {
    try {
      const { vaultId, credentialId } = req.params
      if (!vaultId || !credentialId) {
        return res.status(400).json({
          status: 'Error',
          message: 'Path variables vaultId and credentialId must be specified'
        })
      }
      const vault = await this.vaultCredentialEraser.run({ vaultId, credentialId })
      const { getId: id, getOwner: owner, getLastModified: lastModified, getCredentials } = vault
      return res.status(200).json({
        status: 'Succes',
        message: 'Credential removed succesfully',
        vault: {
          id,
          owner,
          lastModified,
          credentials: getCredentials.map(credential => {
            const { getId: id, getName: name, getSecret: secret, getDescription: description } = credential
            return { id, name, secret, description }
          })
        }
      })
    } catch (error) {
      if (error instanceof VaultNotExistsException) {
        return res.status(404).json({
          status: 'Error',
          message: 'Vault does not exists'
        })
      }
      if (error instanceof CredentialNotExistsException) {
        return res.status(404).json({
          status: 'Error',
          message: 'Credential does not exists'
        })
      }
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error'
      })
    }
  }
}
