import { type Request, type Response } from 'express'
import { type IExpressController } from '../../../../shared/infrastructure/http/IExpressController.js'
import { validateEmail } from '../../../../shared/domain/utils/EmailUtils.js'
import { type UserFinder } from '../../../application/UserFinder.js'
import { type RestoreTokenCreator } from '../../../../restore-token/application/ResotreTokenCreator.js'
import { sendEmail } from '../../../../send-email/infrastructure/dependencies.js'

const expirationTime = process.env.RESTORE_TOKEN_EXPIRATION ?? '30'
const rootWebPage = process.env.ROOT_WEBPAGE ?? 'http://localhost:5173'

export class SendPasswordRestoreController implements IExpressController {
  constructor (
    private readonly userFinder: UserFinder,
    private readonly tokenCreator: RestoreTokenCreator
  ) {}

  async handleRequest (req: Request, res: Response) {
    const { email } = req.body
    if (!email || !validateEmail(email)) {
      return res.status(400).json({
        status: 'Bad request',
        message: 'Email address not specified via request body or provided an invalid email'
      })
    }
    const userList = await this.userFinder.run({ email })
    if (userList.length > 0) {
      const { id } = userList[0]
      const token = await this.tokenCreator.run(id)
      if (token) {
        void sendEmail([email], 'Password Manager: Account password reset', this.setHtmlContent(token.getValue, rootWebPage))
      }
    }
    return res.status(200).json({
      status: 'Success',
      message: `Password recovery email sended to ${(email as string)} if user with that email address exists`
    })
  }

  private setHtmlContent (token: string, hostname: string) {
    const linkHref = `${hostname}/restore-password/${token}`
    return `
    <div style="background-color: #133d64; color: white; padding: 2rem; font-family: Poppins,sans-serif; width: fit-content; border-radius: 10px;">
      <img src="${hostname}/assets/logo-no-background-0210caf7.png" alt="password-manager-logo" width="350px">
      <h2 style="margin-bottom: 2rem;">Someone just requested to reset the password on your account. If this was you, click on the next button to change it.</h2>
      <a href="${linkHref}" target="_blank" style="width: fit-content; padding: 0.8rem 2rem; font-size: medium; color: #f5f5f5; background-color: #31618f; border: none; border-radius: 20px; margin: auto; text-decoration: none;">
        Reset password
      </a>
      <div style="margin-top: 2rem;">
        <h4>This link will expire within ${expirationTime} minutes.</h4>
        <h4>If you don't want to reset your password, just ignore this message and nothing will be changed.</h4>
      </div>
    </div>
      `
  }
}
