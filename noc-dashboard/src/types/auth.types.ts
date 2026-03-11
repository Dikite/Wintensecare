export type LoginRequest = {
  email: string
  password: string
}

export type User = {
  id: string
  email: string
  role: string
}

export type LoginResponse = {
  accessToken: string
  user: User
}