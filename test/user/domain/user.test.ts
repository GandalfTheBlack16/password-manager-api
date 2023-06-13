import { IllegalArgsException } from '../../../src/shared/exception/IllegalArgsException.js'
import { InvalidEmailAddressException } from '../../../src/shared/exception/InvalidEmailAddressException.js'
import { User } from '../../../src/user/domain/User.js'
import { v4 as uuid } from 'uuid'

describe('User domain class', () => {
  it('should create a valid User', () => {
    const expectedId = uuid()
    const expectedEmail = 'user@email.test'
    const expectedUsername = 'dummy'
    const user = new User(expectedId, expectedEmail, expectedUsername)
    expect(user).toBeDefined()
    expect(user.getId).toBe(expectedId)
    expect(user.getEmail).toBe(expectedEmail)
    expect(user.getUsername).toBe(expectedUsername)
  })

  it('should throw invalid id exception', () => {
    let user
    expect(() => {
      user = new User('fake-id', 'user@email.test', 'dummy')
    }).toThrow(IllegalArgsException)

    expect(user).toBeUndefined()
  })

  it('should throw invalid email exception', () => {
    let user
    expect(() => {
      user = new User(uuid(), 'invalid-email-address', 'dummy')
    }).toThrow(InvalidEmailAddressException)

    expect(user).toBeUndefined()
  })

  it('should modify email address', () => {
    const user = new User(uuid(), 'user@email.test', 'dummy')
    const expectedEmail = 'newemail@email.test'
    user.modifyEmail(expectedEmail)
    expect(user).toBeDefined()
    expect(user.getEmail).toBe(expectedEmail)
  })

  it('should throw invalid email exception on modify email address', () => {
    const initialEmail = 'user@email.test'
    const invalidEmail = 'invalid-email-address'
    const user = new User(uuid(), initialEmail, 'dummy')
    expect(() => {
      user.modifyEmail(invalidEmail)
    }).toThrow(InvalidEmailAddressException)
    expect(user.getEmail).toBe(initialEmail)
  })

  it('should modify username', () => {
    const user = new User(uuid(), 'user@email.test', 'dummy')
    const expectedUsername = 'newDummyName'
    user.modifyUsername(expectedUsername)
    expect(user).toBeDefined()
    expect(user.getUsername).toBe(expectedUsername)
  })
})
