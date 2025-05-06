export interface UserRoles {
  user: number,
  admin: number,
  superadmin: number,
}

export interface BaseUser {
  fullname: string,
  email: string,
  password?: string,
  createdAt: string,
  updatedAt: string,
  activatedAt?: string,
  deletedAt?: string,
  userPermissions?: string[],
}

export interface User extends BaseUser {
  id : string
}

export interface AuthenticatedUser extends User {
  accessToken: string,
  refreshToken: string,
}
