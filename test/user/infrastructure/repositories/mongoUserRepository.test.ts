import { User } from '../../../../src/user/domain/User.js'
import { UserModel } from '../../../../src/user/infrastructure/db/models/UserModel.js'
import { MongoUserRepository } from '../../../../src/user/infrastructure/db/repositories/MongoUserRepository.js'
import { v4 as UUID, NIL } from 'uuid'

describe('MongoUserRepository test', () => {
  let repository: MongoUserRepository

  beforeEach(() => {
    repository = new MongoUserRepository()
  })

  it('should return an empty collection', async () => {
    jest.spyOn(UserModel, 'find').mockResolvedValue([])
    const list = await repository.getUsers()
    expect(UserModel.find).toHaveBeenCalled()
    expect(list).toBeDefined()
    expect(list.length).toBe(0)
  })

  it('should return a collection of domain user', async () => {
    const mockedResult = [
      { _id: UUID(), email: 'email1@test.com', username: 'user1', password: 'password1#1234' },
      { _id: UUID(), email: 'email2@test.com', username: 'user2', password: 'password2#1234' },
      { _id: UUID(), email: 'email3@test.com', username: 'user3', password: 'password3#1234' },
      { _id: UUID(), email: 'email4@test.com', username: 'user4', password: 'password4#1234' }
    ]
    jest.spyOn(UserModel, 'find').mockResolvedValue(mockedResult)
    const list = await repository.getUsers()
    expect(UserModel.find).toHaveBeenCalled()
    expect(list).toBeDefined()
    expect(list.length).toBeGreaterThan(0)
    expect(list.every(item => item instanceof User)).toBeTruthy()
  })

  it('should return null on getting by unexisting id', async () => {
    jest.spyOn(UserModel, 'findById').mockResolvedValue(null)
    const user = await repository.getUserById(NIL)
    expect(UserModel.findById).toHaveBeenCalledWith(NIL)
    expect(user).toBeNull()
  })

  it('should return a valid domain user on getting by id', async () => {
    const mockedResult = { _id: NIL, email: 'email1@test.com', username: 'user1', password: 'password1#1234' }
    jest.spyOn(UserModel, 'findById').mockResolvedValue(mockedResult)
    const user = await repository.getUserById(NIL)
    expect(UserModel.findById).toHaveBeenCalledWith(NIL)
    expect(user).toBeDefined()
    expect(user instanceof User).toBeTruthy()
    expect(user?.getId).toBe(NIL)
  })
})
