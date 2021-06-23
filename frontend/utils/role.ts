import { IUser } from 'core/interfaces'
import { ROLES } from 'constants/roles'

// FIXME define dynamic type from constants if it's possible
interface IRoleFlags {
  isAdmin: boolean
  isGuest: boolean
  isHost: boolean
}

export const getRoleFlagsFromUser = (user: IUser): IRoleFlags => {
  const userRoles = user?.roles ?? []
  const result = Object.entries(ROLES).reduce((acc, [key, value]) => {
    acc[`is${key}`] = userRoles.some(userRole => userRole.id === value.id)
    return acc
  }, {}) as IRoleFlags
  return result
}
