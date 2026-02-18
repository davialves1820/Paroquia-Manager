import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import PastoralService from '#services/pastoral_service'

@inject()
export default class PastoralsController {
    constructor(protected pastoralService: PastoralService) { }

    async index() {
        return this.pastoralService.all()
    }

    async show({ params }: HttpContext) {
        return this.pastoralService.find(params.id)
    }

    async store({ request, response }: HttpContext) {
        const data = request.all()
        const pastoral = await this.pastoralService.create(data)
        return response.created(pastoral)
    }

    async update({ params, request }: HttpContext) {
        const data = request.all()
        return this.pastoralService.update(params.id, data)
    }

    async destroy({ params, response }: HttpContext) {
        await this.pastoralService.delete(params.id)
        return response.noContent()
    }

    async addMember({ params, request }: HttpContext) {
        const { memberId } = request.only(['memberId'])
        return this.pastoralService.addMember(params.id, memberId)
    }

    async removeMember({ params, request }: HttpContext) {
        const { memberId } = request.only(['memberId'])
        return this.pastoralService.removeMember(params.id, memberId)
    }

    async addCoordinator({ params, request }: HttpContext) {
        const { userId } = request.only(['userId'])
        return this.pastoralService.addCoordinator(params.id, userId)
    }

    async removeCoordinator({ params, request }: HttpContext) {
        const { userId } = request.only(['userId'])
        return this.pastoralService.removeCoordinator(params.id, userId)
    }
}