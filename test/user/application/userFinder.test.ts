import { UserFinder } from '../../../src/user/application/UserFinder.js'
import { User } from '../../../src/user/domain/User.js'
import { UserRepositoryStub } from '../../resources/stubs/userRepositoryStub.js'
import { v4 as UUID } from 'uuid'

describe('Fetch user(s) use-case', () => {
  let userFinder: UserFinder
  const userRepository = new UserRepositoryStub()

  beforeEach(() => {
    userFinder = new UserFinder(userRepository)
  })

  it('should return an empty user list with no filter params', async () => {
    const userList = await userFinder.run()
    expect(userList).toBeDefined()
    expect(userList.length).toBe(0)
  })

  it('should return a user list with one user', async () => {
    const user = new User(UUID(), 'fake@email.com', 'fake', 'Fake1234#!')
    await userRepository.createUser(user)
    const userList = await userFinder.run()
    expect(userList).toBeDefined()
    expect(userList.length).toBe(1)
  })

  it('should return empty user list with id filter', async () => {
    const userList = await userFinder.run({ id: 'fakeId' })
    expect(userList).toBeDefined()
    expect(userList.length).toBe(0)
  })

  it('should return empty user list with email filter', async () => {
    const userList = await userFinder.run({ email: 'test@fakeemail.com' })
    expect(userList).toBeDefined()
    expect(userList.length).toBe(0)
  })

  it('should return empty user list with username filter', async () => {
    const userList = await userFinder.run({ username: 'fakeUsername' })
    expect(userList).toBeDefined()
    expect(userList.length).toBe(0)
  })

  it('should return single user with id filter', async () => {
    const user = new User(UUID(), 'fake@email.com', 'fake', 'Fake1234#!')
    await userRepository.createUser(user)
    const userList = await userFinder.run({ id: user.getId })
    expect(userList).toBeDefined()
    expect(userList.length).toBe(1)
    expect(userList.at(0)?.id).toBe(user.getId)
  })

  it('should return single user with email filter', async () => {
    const user = new User(UUID(), 'fake@email.com', 'fake', 'Fake1234#!')
    await userRepository.createUser(user)
    const userList = await userFinder.run({ email: user.getEmail })
    expect(userList).toBeDefined()
    expect(userList.length).toBe(1)
    expect(userList.at(0)?.email).toBe('fake@email.com')
  })

  it('should return single user with username filter', async () => {
    const user = new User(UUID(), 'fake@email.com', 'fake', 'Fake1234#!')
    await userRepository.createUser(user)
    const userList = await userFinder.run({ username: user.getUsername })
    expect(userList).toBeDefined()
    expect(userList.length).toBe(1)
    expect(userList.at(0)?.username).toBe('fake')
  })
})
