import { UserLogin } from '../../../src/user/application/UserLogin.js'
import { User } from '../../../src/user/domain/User.js'
import { UserRepositoryStub } from './resources/userRepositoryStub.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { hashPassword, verifyJwt } from '../../../src/shared/application/crypto/CryptoUtils.js'

describe('User login use-case', () => {
  let userLoger: UserLogin
  const userRepository = new UserRepositoryStub()

  beforeEach(() => {
    userLoger = new UserLogin(userRepository)
  })

  it('Should perform login using email if username is not defined', async () => {
    jest.spyOn(userRepository, 'getUserByEmail')
    await userLoger.run({ username: '', email: 'test@UserEmail.com', password: 'dummy', keepLoggedIn: false })
    expect(userRepository.getUserByEmail).toHaveBeenCalled()
  })

  it('Should perform login using username if email is not defined', async () => {
    jest.spyOn(userRepository, 'getUserByUsername')
    await userLoger.run({ username: 'test', email: '', password: 'dummy', keepLoggedIn: false })
    expect(userRepository.getUserByUsername).toHaveBeenCalled()
  })

  it('Should return invalid response if user is not found', async () => {
    jest.spyOn(userRepository, 'getUserByUsername').mockReturnValue(Promise.resolve(null))
    const response = await userLoger.run({ username: 'test', email: '', password: 'dummy', keepLoggedIn: false })
    expect(response.status).toBe('Unauthorized')
    expect(response.message).toBe('Invalid username/email or password')
  })

  it('Should return invalid response if password does not match', async () => {
    const user = new User('550e8400-e29b-41d4-a716-446655440000', 'email@email.com', 'username', 'invalidPassword')
    jest.spyOn(userRepository, 'getUserByUsername').mockReturnValue(Promise.resolve(user))
    const response = await userLoger.run({ username: 'test', email: '', password: 'dummy', keepLoggedIn: false })
    expect(response.status).toBe('Unauthorized')
    expect(response.message).toBe('Invalid username/email or password')
  })

  it('Should return a valid token on login', async () => {
    const hashedPassword = hashPassword('dummyPassword')
    const user = new User('550e8400-e29b-41d4-a716-446655440000', 'email@email.com', 'username', hashedPassword)
    jest.spyOn(userRepository, 'getUserByUsername').mockReturnValue(Promise.resolve(user))
    const response = await userLoger.run({ username: 'test', email: '', password: 'dummyPassword', keepLoggedIn: false })
    const { status, accessToken } = response
    expect(status).toBe('Sucess')
    expect(accessToken).toBeDefined()
    if (accessToken) {
      expect(verifyJwt(accessToken)).toBeDefined()
    }
  })
})
