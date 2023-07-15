export interface CreateUserDto {
  email: string
  username: string
  password: string
}

export interface FindUserDto {
  id?: string
  email?: string
  username?: string
}
