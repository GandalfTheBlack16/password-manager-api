export class TokenValidationException extends Error {
  constructor (
    public readonly message: string,
    private readonly tokenId: string
  ) {
    super(`${message}: ${tokenId}`)
  }

  get getMessage () {
    return this.message
  }

  get getTokenId () {
    return this.tokenId
  }
}
