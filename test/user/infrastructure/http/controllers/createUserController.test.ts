import supertest from 'supertest'
import { app, userRepository } from '../expressAppTestContext.js'
import { validate } from 'uuid'

describe('Create user Express controller E2E test', () => {
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
          expect(expectedUser.getPassword).toBe(newUser.password)
          expect(validate(expectedUser.getId)).toBeTruthy()
        }
      })
  })
})
