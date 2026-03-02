import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class SacramentPolicy extends BasePolicy {
  /**
   * Only ADMIN and PADRE can create, edit, or delete sacraments.
   */
  async handle(user: User): Promise<AuthorizerResponse> {
    return user.role === 'ADMIN' || user.role === 'PADRE'
  }

  /**
   * A priest can view their own agenda.
   * Admin can view all agendas.
   */
  async viewAgenda(user: User, priestId: number): Promise<AuthorizerResponse> {
    if (user.role === 'ADMIN') {
      return true
    }

    if (user.role === 'PADRE') {
      return user.id === priestId
    }

    return false
  }
}
