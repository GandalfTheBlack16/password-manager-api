import { IllegalArgException } from '../../../src/shared/domain/exception/IllegalArgException.js'
import { User } from '../../../src/user/domain/User.js'
import { v4 as uuid } from 'uuid'

describe('User domain class', () => {
  it('should create a valid User', () => {
    const expectedId = uuid()
    const expectedEmail = 'user@email.test'
    const expectedUsername = 'dummy'
    const expectedPassword = 'Passwd1234#'
    const user = new User(expectedId, expectedEmail, expectedUsername, expectedPassword)
    expect(user).toBeDefined()
    expect(user.getId).toBe(expectedId)
    expect(user.getEmail).toBe(expectedEmail)
    expect(user.getUsername).toBe(expectedUsername)
  })

  it('should throw invalid id exception', () => {
    let user
    expect(() => {
      user = new User('fake-id', 'user@email.test', 'dummy', 'Passwd1234#')
    }).toThrow(IllegalArgException)

    expect(user).toBeUndefined()
  })

  it('should throw invalid email exception', () => {
    let user
    expect(() => {
      user = new User(uuid(), 'invalid-email-address', 'dummy', 'Passwd1234#')
    }).toThrow(IllegalArgException)

    expect(user).toBeUndefined()
  })

  it('should throw invalid password exception', () => {
    let user
    expect(() => {
      user = new User(uuid(), 'invalid-email-address', 'dummy', 'passwd')
    }).toThrow(IllegalArgException)

    expect(user).toBeUndefined()
  })

  it('should modify email address', () => {
    const user = new User(uuid(), 'user@email.test', 'dummy', 'Passwd1234#')
    const expectedEmail = 'newemail@email.test'
    user.modifyEmail(expectedEmail)
    expect(user).toBeDefined()
    expect(user.getEmail).toBe(expectedEmail)
  })

  it('should throw invalid email exception on modify email address', () => {
    const initialEmail = 'user@email.test'
    const invalidEmail = 'invalid-email-address'
    const user = new User(uuid(), initialEmail, 'dummy', 'Passwd1234#')
    expect(() => {
      user.modifyEmail(invalidEmail)
    }).toThrow(IllegalArgException)
    expect(user.getEmail).toBe(initialEmail)
  })

  it('should modify username', () => {
    const user = new User(uuid(), 'user@email.test', 'dummy', 'Passwd1234#')
    const expectedUsername = 'newDummyName'
    user.modifyUsername(expectedUsername)
    expect(user).toBeDefined()
    expect(user.getUsername).toBe(expectedUsername)
  })

  it('should modify password', () => {
    const user = new User(uuid(), 'user@email.test', 'dummy', 'Passwd1234#')
    const expectedPassword = '4321#NewPassword'
    user.modifyPassword(expectedPassword)
    expect(user).toBeDefined()
    expect(user.getPassword).toBe(expectedPassword)
  })

  it('should throw invalid password exception on modify password', () => {
    const initialPassword = 'Passwd1234#'
    const invalidPassword = 'invalid-password'
    const user = new User(uuid(), 'user@email.test', 'dummy', 'Passwd1234#')
    expect(() => {
      user.modifyPassword(invalidPassword)
    }).toThrow(IllegalArgException)
    expect(user.getPassword).toBe(initialPassword)
  })
})
