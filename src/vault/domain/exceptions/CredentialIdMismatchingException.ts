export class CredentialIdMismathchingException extends Error {
  constructor (
    currentId: string,
    actualId: string
  ) {
    super(`Credential already exists with id ${actualId} and cannot match it with id ${currentId}`)
  }
}
