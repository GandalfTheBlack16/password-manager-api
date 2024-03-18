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

export interface LoginUserDto {
  email?: string
  username?: string
  password: string
}

export interface LoginUserResponseDto {
  status: string
  message?: string
  accessToken?: string
  userInfo?: FindUserDto
}

export interface UpdatePasswordDto {
  userId: string
  oldPassword?: string
  newPassword: string
}
