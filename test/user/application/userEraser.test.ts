import { UserEraser } from '../../../src/user/application/UserEraser';
import { UserDoesNotExistsException } from '../../../src/user/application/exception/UserDoesNotExistsException';
import { User } from '../../../src/user/domain/User';
import { UserRepositoryStub } from './resources/userRepositoryStub';
import { v4 as uuid } from 'uuid';

describe('User delete use-case', () => {
    let userEraser: UserEraser
    let userRepository: UserRepositoryStub

    beforeEach(() => {
        userRepository = new UserRepositoryStub()
        userEraser = new UserEraser(userRepository)
    })

    it('should throw exception if user does not exists', async () => {
        jest.spyOn(userRepository, 'deleteUser').mockResolvedValue(false)
        try {
            await userEraser.run('fakeId')
        } catch (error) {
            expect(userRepository.deleteUser).toHaveBeenCalledWith('fakeId')
            expect(error).toBeInstanceOf(UserDoesNotExistsException)
        }
    })

    it('should delete a user', async () => {
        const selectedId = uuid()
        userRepository.createUser(new User(uuid(), 'email@test.com', 'user1', 'testPassword'))
        userRepository.createUser(new User(uuid(), 'email2@test.com', 'user2', 'testPassword'))
        userRepository.createUser(new User(selectedId, 'email3@test.com', 'selectedUser', 'testPassword'))
        userRepository.createUser(new User(uuid(), 'email4@test.com', 'user3', 'testPassword'))
        await userEraser.run(selectedId)
        const userList = await userRepository.getUsers()
        expect(userList.length).toBe(3)
        expect(userList.find(i => i.getUsername === 'selectedUser')).toBeUndefined()
    })
})