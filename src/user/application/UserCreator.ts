import { UserAlreadyExistsException } from './exception/UserAlreadyExistsException.js'
import { User } from '../domain/User.js'
import { type UserRepository } from '../domain/repositories/UserRepository.js'
import { type CreateUserDto } from './user-types.js'
import { v4 as UUID } from 'uuid'
import { pbkdf2Sync } from 'crypto'

export class UserCreator {
  constructor (private readonly userRepository: UserRepository) {}

  private readonly PASSWORD_SALT = process.env.PASSWORD_SALT ?? '00000000'

  async run ({
    email,
    username,
    password
  }: CreateUserDto): Promise<User> {
    const uuid = UUID()
    const user = new User(uuid, email, username, this.hashPassword(password))
    const created = await this.userRepository.createUser(user)
    if (!created) {
      throw new UserAlreadyExistsException(`Cannot create user with email ${email}`)
    }
    return created
  }

  private hashPassword (password: string) {
    return pbkdf2Sync(password, this.PASSWORD_SALT, 10000, 64, 'sha512').toString('hex')
  }
}
