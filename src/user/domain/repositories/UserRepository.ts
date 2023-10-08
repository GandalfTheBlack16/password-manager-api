import { type User } from '../User.js'

export interface UserRepository {
  getUsers: () => Promise<User[]>
  getUserById: (id: string) => Promise<User | null>
  getUserByEmail: (email: string) => Promise<User | null>
  getUserByUsername: (username: string) => Promise<User | null>
  createUser: (user: User) => Promise<User | null>
  updateUser: (user: User) => Promise<User | null>
  deleteUser: (id: string) => Promise<void>
}
