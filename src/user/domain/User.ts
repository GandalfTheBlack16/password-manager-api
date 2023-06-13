import { UserEmail } from './valueObjects/UserEmail.js'
import { UserId } from './valueObjects/UserId.js'

export class User {
  private readonly id: UserId
  private email: UserEmail
  private username: string

  constructor (id: string, email: string, username: string) {
    this.id = new UserId(id)
    this.email = new UserEmail(email)
    this.username = username
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

  modifyEmail (newAddress: string): void {
    this.email = new UserEmail(newAddress)
  }

  modifyUsername (newUsername: string): void {
    this.username = newUsername
  }
}
