export class RestoreToken {
  private readonly id: string
  private readonly value: string
  private readonly userId: string
  private readonly createdAt: Date
  private readonly expireAt: Date
  private enable: boolean

  constructor (
    tokenId: string,
    token: string,
    userId: string
  ) {
    this.id = tokenId
    this.value = token
    this.userId = userId
    this.createdAt = new Date()
    this.expireAt = new Date(new Date().getTime() + Number(process.env.RESTORE_TOKEN_EXPIRATION) ?? 30 * 60000)
    this.enable = true
  }

  get getId () {
    return this.id
  }

  get getValue () {
    return this.value
  }

  get getUserId () {
    return this.userId
  }

  get getExpireAt () {
    return this.expireAt
  }

  get isEnabled () {
    return this.enable
  }

  set isEnabled (enable: boolean) {
    this.enable = enable
  }
}
