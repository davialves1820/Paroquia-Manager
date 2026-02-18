import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
    /**
     * List all users
     */
    async index({ response }: HttpContext) {
        const users = await User.all()
        return response.ok(users)
    }

    /**
     * Display a single user
     */
    async show({ params, response }: HttpContext) {
        const user = await User.findOrFail(params.id)
        return response.ok(user)
    }

    /**
     * Create a new user
     */
    async store({ request, response }: HttpContext) {
        const data = request.only(['fullName', 'email', 'password'])
        // Forçamos a role para FIEL para novos cadastros públicos
        const user = await User.create({ ...data, role: 'FIEL' })
        return response.created(user)
    }

    /**
     * Update user details
     */
    async update({ params, request, response }: HttpContext) {
        const user = await User.findOrFail(params.id)
        const data = request.only(['fullName', 'email', 'role'])

        // Check if password is being updated
        const password = request.input('password')
        if (password) {
            user.password = password
        }

        user.merge(data)
        await user.save()
        return response.ok(user)
    }

    /**
     * Delete a user
     */
    async destroy({ params, response }: HttpContext) {
        const user = await User.findOrFail(params.id)
        await user.delete()
        return response.noContent()
    }
}
