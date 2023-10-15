import { hashPassword } from '../../../src/shared/application/crypto/CryptoUtils';
import { UserPasswordUpdater } from '../../../src/user/application/UserPasswordUpdater';
import { UserDoesNotExistsException } from '../../../src/user/application/exception/UserDoesNotExistsException';
import { UserPasswordNotMatchException } from '../../../src/user/application/exception/UserPasswordNotMatchException';
import { User } from '../../../src/user/domain/User';
import { UserRepositoryStub } from './resources/userRepositoryStub';
import { v4 as uuid } from 'uuid';

describe('Change user password use-case', () => {
    let userPasswordUpdater: UserPasswordUpdater
    let userRepository: UserRepositoryStub

    beforeEach(() => {
        userRepository = new UserRepositoryStub()
        userPasswordUpdater = new UserPasswordUpdater(userRepository)
    })

    it('should throw an exeception if user does not exists', async () => {
        jest.spyOn(userRepository, 'getUserById').mockResolvedValue(null)
        try {
            await userPasswordUpdater.run({ userId: 'fakeId', oldPassword: 'password', newPassword: 'newPassword' })
        } catch (error) {
            expect(userRepository.getUserById).toHaveBeenCalledWith('fakeId')
            expect(error).toBeInstanceOf(UserDoesNotExistsException)
        }
    })

    it('should throw an exeception if old password does not match', async () => {
        const expectedId = uuid()
        const expectedUser = new User(expectedId, 'email@test.com', 'test', hashPassword('oldPassword'))
        jest.spyOn(userRepository, 'getUserById').mockResolvedValue(expectedUser)
        try {
            await userPasswordUpdater.run({ userId: expectedId, oldPassword: 'fakePassword', newPassword: 'newPassword' })
        } catch (error) {
            expect(userRepository.getUserById).toHaveBeenCalledWith(expectedId)
            expect(error).toBeInstanceOf(UserPasswordNotMatchException)
        }
    })

    it('should update user password', async () => {
        const expectedId = uuid()
        userRepository.createUser(new User(expectedId, 'email@test.com', 'test', hashPassword('oldPassword')))
        const user = await userPasswordUpdater.run({ userId: expectedId, oldPassword: 'oldPassword', newPassword: 'newPassword' })
        expect(user).toBeDefined()
        expect(user?.getPassword).toBe(hashPassword('newPassword'))
    })
})