import { CredentialId } from './valueObjects/CredentialId.js'

export class Credential {
  private readonly id: CredentialId
  private readonly name: string
  private readonly secret: string
  private readonly description?: string

  constructor (
    id: string,
    name: string,
    secret: string,
    description?: string
  ) {
    this.id = new CredentialId(id)
    this.name = name
    this.secret = secret
    this.description = description
  }

  get getId (): string {
    return this.id.getValue
  }

  get getName (): string {
    return this.name
  }

  get getSecret (): string {
    return this.secret
  }

  get getDescription (): string | undefined {
    return this.description
  }
}
