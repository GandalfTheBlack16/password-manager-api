import { type Express } from 'express'
import supertest from 'supertest'
import { v4 as UUID } from 'uuid'
import { type UserRepository } from '../../../../../src/user/domain/repositories/UserRepository.js'
import { initContext } from '../expressAppTestContext.js'
import { User } from '../../../../../src/user/domain/User.js'

//TODO: Change this test since this controller is meant to check if username or email is available
describe('Find user Express controlle integration test', () => {
  let app: Express
  let userRepository: UserRepository

  beforeEach(() => {
    const { app: application, userRepository: repository } = initContext()
    app = application
    userRepository = repository
  })

  it('should return 404 with no results if does not exists any user', async () => {
    await supertest(app)
      .get('/api/user/')
      .expect(404)
      .then((response) => {
        expect(response.body).toBeDefined()
        const { status, message } = response.body
        expect(status).toBe('Success')
        expect(message).toBe('Without results')
      })
  })

  it('should return 200 with user list result', async () => {
    await userRepository.createUser(new User(UUID(), 'email1@test.com', 'user1', 'user1#1234'))
    await userRepository.createUser(new User(UUID(), 'email2@test.com', 'user2', 'user1#1234'))
    await userRepository.createUser(new User(UUID(), 'email3@test.com', 'user3', 'user1#1234'))

    await supertest(app)
      .get('/api/user/')
      .expect(200)
      .then((response) => {
        expect(response.body).toBeDefined()
        const { status, list } = response.body
        expect(status).toBe('Success')
        expect(list).toBeInstanceOf(Array<User>)
        expect(list.length).toBe(3)
      })
  })
})
