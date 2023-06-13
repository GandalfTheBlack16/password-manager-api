import { UserEmail } from './valueObjects/UserEmail.js'
import { UserId } from './valueObjects/UserId.js'
import { UserPassword } from './valueObjects/UserPassword.js'

export class User {
  private readonly id: UserId
  private email: UserEmail
  private username: string
  private password: UserPassword

  constructor (id: string, email: string, username: string, password: string) {
    this.id = new UserId(id)
    this.email = new UserEmail(email)
    this.username = username
    this.password = new UserPassword(password)
  }

  get getId (): string {
    return this.id.getValue
  }

  get getEmail (): string {
    return this.email.getValue
  }

  get getUsername (): string {
    return this.username
  }

  get getPassword (): string {
    return this.password.getValue
  }

  modifyEmail (newAddress: string): void {
    this.email = new UserEmail(newAddress)
  }

  modifyUsername (newUsername: string): void {
    this.username = newUsername
  }

  modifyPassword (newPassword: string): void {
    this.password = new UserPassword(newPassword)
  }
}
