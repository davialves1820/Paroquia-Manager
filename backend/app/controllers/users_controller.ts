import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  /**
   * @index
   * @description List all users
   * @showSummary true
   */
  async index({ response }: HttpContext) {
    const users = await User.all()
    return response.ok(users)
  }

  /**
   * @show
   * @description Display a single user
   * @showSummary true
   * @paramPath id - User ID - Example: 1
   */
  async show({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return response.ok(user)
  }

  /**
   * @store
   * @description Create a new user
   * @showSummary true
   * @requestBody <User>
   */
  async store({ request, response }: HttpContext) {
    const data = request.only(['fullName', 'email', 'password'])
    // Forçamos a role para FIEL para novos cadastros públicos
    const user = await User.create({ ...data, role: 'FIEL' })
    return response.created(user)
  }

  /**
   * @update
   * @description Update user details
   * @showSummary true
   * @paramPath id - User ID - Example: 1
   * @requestBody <User>
   */
  async update({ bouncer, params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)

    // Authorize the update behavior
    if (await bouncer.with('UserPolicy').denies('update', user)) {
      return response.forbidden({ error: 'You are not authorized to edit this user' })
    }

    const data = request.only(['fullName', 'email', 'role'])

    // Role validation
    const validRoles = ['ADMIN', 'PADRE', 'SECRETARIA', 'COORDENADOR', 'FIEL']
    if (data.role && !validRoles.includes(data.role)) {
      return response.badRequest({ error: 'Invalid role assigned' })
    }

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
   * @destroy
   * @description Delete a user
   * @showSummary true
   * @paramPath id - User ID - Example: 1
   */
  async destroy({ bouncer, params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)

    // Authorize the delete behavior
    if (await bouncer.with('UserPolicy').denies('delete', user)) {
      return response.forbidden({ error: 'You are not authorized to delete this user' })
    }

    await user.delete()
    return response.noContent()
  }
}
