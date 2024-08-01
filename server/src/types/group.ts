export type UserGroup = {
  id?: string
  name: string
  description: string
  visibility: GroupVisibility
  members: string
  joinPermission: JoinPermission
  postPermission: PostPermission
  rules?: any
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
