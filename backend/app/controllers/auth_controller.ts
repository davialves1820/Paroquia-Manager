import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import AuthService from '#services/auth_service'

@inject()
export default class AuthController {
    constructor(protected authService: AuthService) { }

    async login(ctx: HttpContext) {
        return this.authService.login(ctx)
    }

    async logout(ctx: HttpContext) {
        return this.authService.logout(ctx)
    }

    async me(ctx: HttpContext) {
        return this.authService.me(ctx)
    }
}
