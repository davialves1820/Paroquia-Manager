import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class UserPolicy extends BasePolicy {
  /**
   * Only ADMIN and PADRE can edit user roles.
   * Additionally, we might want to prevent PADRE from editing ADMINs.
   */
  async update(user: User, targetUser: User): Promise<AuthorizerResponse> {
    if (user.role === 'ADMIN') {
      return true
    }

    if (user.role === 'PADRE') {
      // PADRE cannot edit ADMIN users
      return targetUser.role !== 'ADMIN'
    }

    return false
  }

  /**
   * Only ADMIN and PADRE can delete users.
   */
  async delete(user: User, targetUser: User): Promise<AuthorizerResponse> {
    if (user.role === 'ADMIN') {
      return true
    }

    if (user.role === 'PADRE') {
      return targetUser.role !== 'ADMIN'
    }

    return false
  }
}
