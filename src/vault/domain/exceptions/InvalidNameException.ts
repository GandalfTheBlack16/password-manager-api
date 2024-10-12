export class InvalidNameException extends Error {
  constructor (
    name: string
  ) {
    super(`Invalid Vault name ${name}: Name length should be more than 3 and less than 24 characters`)
  }
}
