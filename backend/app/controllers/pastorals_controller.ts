import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import PastoralService from '#services/pastoral_service'
import Pastoral from '#models/pastoral'

@inject()
export default class PastoralsController {
  constructor(protected pastoralService: PastoralService) {}

  /**
   * @index
   * @description List all pastorals
   * @showSummary true
   */
  async index() {
    return this.pastoralService.all()
  }

  /**
   * @show
   * @description Display a single pastoral
   * @showSummary true
   * @paramPath id - Pastoral ID - Example: 1
   */
  async show({ params }: HttpContext) {
    return this.pastoralService.find(params.id)
  }

  /**
   * @store
   * @description Create a new pastoral
   * @showSummary true
   * @requestBody <Pastoral>
   */
  async store({ bouncer, request, response }: HttpContext) {
    if (await bouncer.with('PastoralPolicy').denies('handle')) {
      return response.forbidden({ error: 'Only Admin/Priest can create pastorals' })
    }
    const data = request.all()
    const pastoral = await this.pastoralService.create(data)
    return response.created(pastoral)
  }

  /**
   * @update
   * @description Update pastoral details
   * @showSummary true
   * @paramPath id - Pastoral ID - Example: 1
   * @requestBody <Pastoral>
   */
  async update({ bouncer, params, request, response }: HttpContext) {
    if (await bouncer.with('PastoralPolicy').denies('handle')) {
      return response.forbidden({ error: 'Only Admin/Priest can update pastorals' })
    }
    const data = request.all()
    return this.pastoralService.update(params.id, data)
  }

  /**
   * @destroy
   * @description Delete a pastoral
   * @showSummary true
   * @paramPath id - Pastoral ID - Example: 1
   */
  async destroy({ bouncer, params, response }: HttpContext) {
    if (await bouncer.with('PastoralPolicy').denies('handle')) {
      return response.forbidden({ error: 'Only Admin/Priest can delete pastorals' })
    }
    await this.pastoralService.delete(params.id)
    return response.noContent()
  }

  /**
   * @addMember
   * @description Add a member to a pastoral
   * @showSummary true
   * @paramPath id - Pastoral ID - Example: 1
   * @requestBody {"memberId": 1}
   */
  async addMember({ bouncer, params, request, response }: HttpContext) {
    const pastoral = await Pastoral.findOrFail(params.id)
    if (await bouncer.with('PastoralPolicy').denies('manageMembers', pastoral)) {
      return response.forbidden({
        error: 'You are not authorized to manage members for this pastoral',
      })
    }
    const { memberId } = request.only(['memberId'])
    return this.pastoralService.addMember(params.id, memberId)
  }

  /**
   * @removeMember
   * @description Remove a member from a pastoral
   * @showSummary true
   * @paramPath id - Pastoral ID - Example: 1
   * @requestBody {"memberId": 1}
   */
  async removeMember({ bouncer, params, request, response }: HttpContext) {
    const pastoral = await Pastoral.findOrFail(params.id)
    if (await bouncer.with('PastoralPolicy').denies('manageMembers', pastoral)) {
      return response.forbidden({
        error: 'You are not authorized to manage members for this pastoral',
      })
    }
    const { memberId } = request.only(['memberId'])
    return this.pastoralService.removeMember(params.id, memberId)
  }

  /**
   * @addCoordinator
   * @description Add a coordinator to a pastoral
   * @showSummary true
   * @paramPath id - Pastoral ID - Example: 1
   * @requestBody {"userId": 1}
   */
  async addCoordinator({ bouncer, params, request, response }: HttpContext) {
    if (await bouncer.with('PastoralPolicy').denies('manageCoordinators')) {
      return response.forbidden({ error: 'Only Admin/Priest can manage coordinators' })
    }
    const { userId } = request.only(['userId'])
    return this.pastoralService.addCoordinator(params.id, userId)
  }

  /**
   * @removeCoordinator
   * @description Remove a coordinator from a pastoral
   * @showSummary true
   * @paramPath id - Pastoral ID - Example: 1
   * @requestBody {"userId": 1}
   */
  async removeCoordinator({ bouncer, params, request, response }: HttpContext) {
    if (await bouncer.with('PastoralPolicy').denies('manageCoordinators')) {
      return response.forbidden({ error: 'Only Admin/Priest can manage coordinators' })
    }
    const { userId } = request.only(['userId'])
    return this.pastoralService.removeCoordinator(params.id, userId)
  }

  /**
   * @inviteUser
   * @description Invite a user to join a pastoral
   * @showSummary true
   * @paramPath id - Pastoral ID - Example: 1
   * @requestBody {"userId": 1}
   */
  async inviteUser({ bouncer, params, request, response }: HttpContext) {
    const pastoral = await Pastoral.findOrFail(params.id)
    if (await bouncer.with('PastoralPolicy').denies('manageMembers', pastoral)) {
      return response.forbidden({
        error: 'You are not authorized to invite users to this pastoral',
      })
    }
    const { userId } = request.only(['userId'])
    return this.pastoralService.inviteUser(params.id, userId)
  }
}
