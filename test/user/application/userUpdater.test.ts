import { UserUpdater } from '../../../src/user/application/UserUpdater';
import { UserDoesNotExistsException } from '../../../src/user/application/exception/UserDoesNotExistsException';
import { User } from '../../../src/user/domain/User';
import { UserRepositoryStub } from './resources/userRepositoryStub';
import { v4 as uuid } from 'uuid';
describe('User updater use-case', () => {
    let userUpdater: UserUpdater
    let userRepository: UserRepositoryStub

    beforeEach(() => {
        userRepository = new UserRepositoryStub()
        userUpdater = new UserUpdater(userRepository)
    })

    it('should throw exception if user does not exists', async () => {
        jest.spyOn(userRepository, 'getUserById').mockResolvedValue(null)
        try {
            await userUpdater.run({ id: 'fakeId', email: 'email@email.com', username: 'username' })
        } catch (error) {
            expect(error).toBeInstanceOf(UserDoesNotExistsException)
        }
    })

    it('should change only the email', async () => {
        const expectedId = uuid()
        const originalUser = new User(expectedId, 'original@email.com', 'original', 'password')
        userRepository.createUser(originalUser)

        const updatedUser = await userUpdater.run({ id: expectedId, email: 'newemail@email.com' })
        expect(updatedUser?.getId).toBe(expectedId)
        expect(updatedUser?.getEmail).toBe('newemail@email.com')
        expect(updatedUser?.getUsername).toBe('original')
        expect(updatedUser?.getPassword).toBe('password')
    })

    it('should change only the username', async () => {
        const expectedId = uuid()
        const originalUser = new User(expectedId, 'original@email.com', 'original', 'password')
        userRepository.createUser(originalUser)

        const updatedUser = await userUpdater.run({ id: expectedId, username: 'newusername' })
        expect(updatedUser?.getId).toBe(expectedId)
        expect(updatedUser?.getEmail).toBe('original@email.com')
        expect(updatedUser?.getUsername).toBe('newusername')
        expect(updatedUser?.getPassword).toBe('password')
    })
})