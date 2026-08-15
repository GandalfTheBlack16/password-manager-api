import { type Request, type Response } from 'express'
import { type IExpressController } from '../../../../shared/infrastructure/http/IExpressController.js'
import { UserModel } from '../../db/models/UserModel.js'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

export class GitHubCallbackController implements IExpressController {
  constructor () {}

  async handleRequest (req: Request, res: Response) {
    try {
      const { code } = req.body
      if (!code) {
        return res.status(400).json({ status: 'Error', message: 'No authorization code provided' })
      }

      // Exchange code for GitHub access token using native fetch
      const tokenResp = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code
        })
      })

      const tokenData = await tokenResp.json()
      if (tokenData.error) {
        return res.status(401).json({ status: 'Error', message: 'GitHub authentication failed', details: tokenData.error_description })
      }
      const githubToken = tokenData.access_token

      const userResp = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github.v3+json' }
      })
      const githubUser = await userResp.json()

      let userEmail = githubUser.email
      if (!userEmail) {
        const emailsResp = await fetch('https://api.github.com/user/emails', {
          headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github.v3+json' }
        })
        const emails = await emailsResp.json()
        const primary = Array.isArray(emails) ? emails.find((e: any) => e.primary) : null
        userEmail = primary?.email || `${githubUser.login}@github.local`
      }

      // Find or create user using the model directly
      let userModel = await UserModel.findOne({ githubId: String(githubUser.id) })
      
      if (!userModel) {
        // Check if user exists by email (from traditional sign-up or other OAuth)
        userModel = await UserModel.findOne({ email: userEmail })
        
        if (userModel) {
          // User exists by email, update GitHub info
          userModel.provider = 'github'
          userModel.githubId = String(githubUser.id)
          userModel.avatar = githubUser.avatar_url
          userModel.name = githubUser.name
          await userModel.save()
        } else {
          // Create new user
          const randomPassword = uuidv4()
          const userId = uuidv4()
          userModel = new UserModel({
            _id: userId,
            email: userEmail,
            username: githubUser.login,
            password: randomPassword,
            provider: 'github',
            githubId: String(githubUser.id),
            avatar: githubUser.avatar_url,
            name: githubUser.name
          })
          await userModel.save()
        }
      } else {
        // User exists by githubId, update info
        userModel.email = userEmail
        userModel.avatar = githubUser.avatar_url
        userModel.name = githubUser.name
        await userModel.save()
      }

      const accessToken = jwt.sign({ id: userModel._id.toString(), username: userModel.username, email: userModel.email }, process.env.JWT_SECRET ?? 'your-secret-key', { expiresIn: '7d' })

      return res.status(200).json({ accessToken, userInfo: { id: userModel._id.toString(), username: userModel.username, email: userModel.email } })
    } catch (error: any) {
      console.error('GitHub OAuth Error:', error)
      return res.status(500).json({ status: 'Error', message: error.message ?? 'Authentication failed' })
    }
  }
}
