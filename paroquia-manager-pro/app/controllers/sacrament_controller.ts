import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import SacramentService from '#services/sacrament_service'

@inject()
export default class SacramentController {
    constructor(protected sacramentService: SacramentService) { }

    async index() {
        return this.sacramentService.all()
    }

    async show({ params }: HttpContext) {
        return this.sacramentService.find(params.id)
    }

    async store({ request }: HttpContext) {
        const data = request.all()
        return this.sacramentService.create(data)
    }
}
