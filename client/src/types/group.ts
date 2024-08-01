export type UserGroup = {
  id: number
  name: string
  description: string
  visibility: GroupVisibility
  members: GroupMembership[]
  joinPermission: JoinPermission
  postPermission: PostPermission
  numberOfMembers: number
  rules?: any
}

export type GroupMembership = {
  isCreator: any
  isAdmin: any
  id: string
  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  userId: string
  group: string
  groupId: string
  roles: UserRoles
}

enum GroupVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

enum JoinPermission {
  ANYONE_CAN_JOIN = 'ANYONE_CAN_JOIN',
  APPROVAL_REQUIRED = 'APPROVAL_REQUIRED',
  INVITE_ONLY = 'INVITE_ONLY',
}

enum PostPermission {
  ALL_MEMBERS = 'ALL_MEMBERS',
  MODERATORS_ONLY = 'MODERATORS_ONLY',
}

export enum UserRoles {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  MEMBER = 'MEMBER',
}
