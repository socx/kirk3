export interface User {
  userId?: string,
  fullname: string,
  email: string,
  password?: string,
  createdAt: string,
  updatedAt: string,
  activatedAt?: string,
  deletedAt?: string,
  permissions?: string[],
  team: string,
}


export interface AuthenticatedUser extends User {
  accessToken: string,
}
