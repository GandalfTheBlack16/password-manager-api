import supertest from 'supertest'
import { type Express } from 'express'
import { initContext } from '../expressAppTestContext.js'
import { validate, v4 as UUID } from 'uuid'
import { type UserRepository } from '../../../../../src/user/domain/repositories/UserRepository.js'
import { User } from '../../../../../src/user/domain/User.js'

describe('Create user Express controller integration test', () => {
  let app: Express
  let userRepository: UserRepository

  beforeEach(() => {
    const { app: application, userRepository: repository } = initContext()
    app = application
    userRepository = repository
  })

  it('should create a new user', async () => {
    const newUser = {
      email: 'test@email.com',
      username: 'test',
      password: 'test#1234'
    }
    await supertest(app)
      .post('/api/user/')
      .send(newUser)
      .expect('Content-Type', /json/)
      .expect(201)
      .then(async (response) => {
        expect(response.body).toBeDefined()
        const { status, message, user } = response.body
        expect(status).toBe('Success')
        expect(message).toBe('User created successfully')
        expect(user).toStrictEqual({
          email: newUser.email,
          username: newUser.username
        })
        const expectedUser = await userRepository.getUserByEmail(newUser.email)
        expect(expectedUser).toBeDefined()
        if (expectedUser) {
          expect(validate(expectedUser.getId)).toBeTruthy()
        }
      })
  })

  it('should return validation error message on invalid email provided', async () => {
    const invalidEmailUser = {
      email: 'invalidOne',
      username: 'invalid',
      password: 'test#1234'
    }
    await supertest(app)
      .post('/api/user/')
      .send(invalidEmailUser)
      .expect('Content-Type', /json/)
      .expect(400)
      .then(async (response) => {
        expect(response.body).toBeDefined()
        const { status, message } = response.body
        expect(status).toBe('Validation error')
        expect(message).toBe('Invalid address provided invalidOne')
      })
  })

  it('should return conflict error message if user with certain email already exists', async () => {
    const existingUser = {
      email: 'test@existing.com',
      username: 'test1',
      password: 'test#1234'
    }
    await userRepository.createUser(
      new User(UUID(), existingUser.email, 'anotherUsername', existingUser.password)
    )
    await supertest(app)
      .post('/api/user/')
      .send(existingUser)
      .expect('Content-Type', /json/)
      .expect(409)
      .then(async (response) => {
        expect(response.body).toBeDefined()
        const { status, message } = response.body
        expect(status).toBe('Error')
        expect(message).toBe('User with that username/email already exists')
      })
  })

  it('should return conflict error message if user with certain username already exists', async () => {
    const existingUser = {
      email: 'test@existing.com',
      username: 'test1',
      password: 'test#1234'
    }
    await userRepository.createUser(
      new User(UUID(), 'another@email.com', existingUser.username, existingUser.password)
    )
    await supertest(app)
      .post('/api/user/')
      .send(existingUser)
      .expect('Content-Type', /json/)
      .expect(409)
      .then(async (response) => {
        expect(response.body).toBeDefined()
        const { status, message } = response.body
        expect(status).toBe('Error')
        expect(message).toBe('User with that username/email already exists')
      })
  })

  it('should return unexpected error message', async () => {
    await supertest(app)
      .post('/api/user/')
      .send({})
      .expect(500)
  })
})
