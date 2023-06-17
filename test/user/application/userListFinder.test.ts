import { UserListFinder } from '../../../src/user/application/UserListFinder.js'
import { User } from '../../../src/user/domain/User.js'
import { UserRepositoryStub } from '../../resources/stubs/userRepositoryStub.js'
import { v4 as UUID } from 'uuid'

describe('Fetch user list use-case', () => {
  let userListFinder: UserListFinder
  const userRepository = new UserRepositoryStub()

  beforeEach(() => {
    userListFinder = new UserListFinder(userRepository)
  })

  it('should return an empty user list', async () => {
    const userList = await userListFinder.run()
    expect(userList).toBeDefined()
    expect(userList.length).toBe(0)
  })

  it('should return a user list with one user', async () => {
    const user = new User(UUID(), 'fake@email.com', 'fake', 'Fake1234#!')
    await userRepository.createUser(user)
    const userList = await userListFinder.run()
    expect(userList).toBeDefined()
    expect(userList.length).toBe(1)
  })
})
