import { UserAlreadyExistsException } from '../../../src/shared/domain/exception/UserAlreadyExistsException.js'
import { UserCreator } from '../../../src/user/application/UserCreator.js'
import { UserRepositoryStub } from '../../resources/stubs/userRepositoryStub.js'

describe('User create use-case', () => {
  let userCreator: UserCreator
  const userRepository = new UserRepositoryStub()

  beforeEach(() => {
    userCreator = new UserCreator(userRepository)
  })

  it('Should create a new user', async () => {
    const newUser = await userCreator.run({ email: 'dummy@test.com', username: 'dummy', password: 'dummy1234#passwd' })
    expect(newUser).toBeDefined()
    expect(userRepository.getUserById(newUser.getId)).toBeDefined()
    expect(userRepository.getUserByEmail(newUser.getEmail)).toBeDefined()
  })

  it('Should throw user exists exception if user already exists', async () => {
    try {
      await userCreator.run({ email: 'dummy@test.com', username: 'dummy', password: 'dummy1234#passwd' })
    } catch (err) {
      expect(err).toBeInstanceOf(UserAlreadyExistsException)
    }
  })
})
