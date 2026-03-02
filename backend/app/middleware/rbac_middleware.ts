import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'
import { UserRole } from '#models/user'

/**
 * RBAC Middleware
 */
export default class RbacMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options: { roles: UserRole[] }) {
    const user = ctx.auth.user

    if (!user) {
      return ctx.response.unauthorized({ message: 'Authentication required' })
    }

    if (!options.roles.includes(user.role)) {
      return ctx.response.forbidden({ message: 'Missing permissions for this resource' })
    }

    return next()
  }
}
