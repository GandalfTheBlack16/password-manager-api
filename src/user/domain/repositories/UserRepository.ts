import { type User } from '../User.js'

export interface UserRepository {
  getUsers: () => User[]
  getUserById: (id: string) => User
  getUserByEmail: (email: string) => User
  createUser: (user: User) => User
  updateUser: (user: User) => User
  deleteUser: (user: User) => void
}
