import { UserAlreadyExistsException } from './exception/UserAlreadyExistsException.js'
import { User } from '../domain/User.js'
import { type UserRepository } from '../domain/repositories/UserRepository.js'
import { type CreateUserDto } from './user-types.js'
import { v4 as UUID } from 'uuid'

export class UserCreator {
  constructor (private readonly userRepository: UserRepository) {}

  async run ({
    email,
    username,
    password
  }: CreateUserDto): Promise<User> {
    const uuid = UUID()
    const user = new User(uuid, email, username, password)
    const created = await this.userRepository.createUser(user)
    if (!created) {
      throw new UserAlreadyExistsException(`Cannot create user with email ${email}`)
    }
    return created
  }
}
