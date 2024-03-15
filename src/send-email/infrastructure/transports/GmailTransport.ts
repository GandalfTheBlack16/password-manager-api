import { createTransport } from 'nodemailer'
import { oAuth2Client } from '../security/OauthClient.js'
import { GmailAuthException } from '../exception/GmailAuthException.js'

export const gmailTransport = async () => {
  const { token: accessToken } = await oAuth2Client.getAccessToken()
  if (accessToken == null) {
    throw new GmailAuthException('Could not get an accessToken using oAuth client')
  }

  return createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GOOGLE_ACCOUNT_EMAIL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken
    }
  })
}
