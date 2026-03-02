import User from '#models/user'
import Pastoral from '#models/pastoral'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class PastoralPolicy extends BasePolicy {
  /**
   * ADMIN and PADRE can manage all pastorals.
   * COORDINATOR can only manage their own pastorals.
   */
  async manageMembers(user: User, pastoral: Pastoral): Promise<AuthorizerResponse> {
    if (user.role === 'ADMIN' || user.role === 'PADRE') {
      return true
    }

    if (user.role === 'COORDENADOR') {
      // Check if user is a coordinator of this pastoral
      await pastoral.load('coordinators')
      return pastoral.coordinators.some((c) => c.id === user.id)
    }

    return false
  }

  /**
   * Only ADMIN and PADRE can add or remove coordinators from a pastoral.
   */
  async manageCoordinators(user: User): Promise<AuthorizerResponse> {
    return user.role === 'ADMIN' || user.role === 'PADRE'
  }

  /**
   * Only ADMIN and PADRE can create, update, or delete pastorals.
   */
  async handle(user: User): Promise<AuthorizerResponse> {
    return user.role === 'ADMIN' || user.role === 'PADRE'
  }
}
