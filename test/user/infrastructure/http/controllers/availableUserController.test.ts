import { type Express } from 'express'
import supertest from 'supertest'
import { v4 as UUID } from 'uuid'
import { type UserRepository } from '../../../../../src/user/domain/repositories/UserRepository.js'
import { initContext } from '../expressAppTestContext.js'
import { User } from '../../../../../src/user/domain/User.js'

describe('Check username/email available controller integration test', () => {
  let app: Express
  let userRepository: UserRepository

  beforeEach(() => {
    const { app: application, userRepository: repository } = initContext()
    app = application
    userRepository = repository
  })

  it('should return 400 if username nor email are specified', async () => {
    await supertest(app)
      .get('/api/user/available')
      .expect(400)
      .then((response) => {
        expect(response.body).toBeDefined()
        const { status, message } = response.body
        expect(status).toBe('Error')
        expect(message).toBe('Bad request: "username" or "email" should be specified as query params')
      })
  }) 

  it('should return 200 with user available by username if does not exists', async () => {
    await supertest(app)
      .get('/api/user/available?username=user1')
      .expect(200)
      .then((response) => {
        expect(response.body).toBeDefined()
        const { status, available } = response.body
        expect(status).toBe('Success')
        expect(available).toBeTruthy()
      })
  })

  it('should return 200 with user available by email if does not exists', async () => {
    await supertest(app)
      .get('/api/user/available?email=email@test.com')
      .expect(200)
      .then((response) => {
        expect(response.body).toBeDefined()
        const { status, available } = response.body
        expect(status).toBe('Success')
        expect(available).toBeTruthy()
      })
  })

  it('should return 200 with user not available by username if exists', async () => {
    await userRepository.createUser(new User(UUID(), 'email@test.com', 'user1', 'user1#1234'))

    await supertest(app)
      .get('/api/user/available?username=user1')
      .expect(200)
      .then((response) => {
        expect(response.body).toBeDefined()
        const { status, available } = response.body
        expect(status).toBe('Success')
        expect(available).toBeFalsy()
      })
  })

  it('should return 200 with user not available by email if exists', async () => {
    await userRepository.createUser(new User(UUID(), 'email@test.com', 'user1', 'user1#1234'))

    await supertest(app)
      .get('/api/user/available?email=email@test.com')
      .expect(200)
      .then((response) => {
        expect(response.body).toBeDefined()
        const { status, available } = response.body
        expect(status).toBe('Success')
        expect(available).toBeFalsy()
      })
  })
})
