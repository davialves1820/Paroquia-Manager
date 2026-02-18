import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthService {
    async login({ request, response }: HttpContext) {
        const { email, password } = request.only(['email', 'password'])

        console.log('[AuthService] Tentativa de login:')
        console.log(`- Email recebido: ${email}`)
        console.log(`- Senha recebida (tamanho): ${password?.length || 0}`)

        try {
            const user = await User.verifyCredentials(email, password)
            const token = await User.accessTokens.create(user)

            return response.ok({
                token: token,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                },
            })
        } catch (error) {
            console.error('Erro no login:', error)
            return response.badRequest({ message: 'Invalid credentials' })
        }
    }

    async logout({ auth, response }: HttpContext) {
        const user = auth.user!
        await User.accessTokens.delete(user, user.currentAccessToken.identifier)
        return response.ok({ message: 'Logged out successfully' })
    }

    async me({ auth, response }: HttpContext) {
        return response.ok(auth.user)
    }
}
