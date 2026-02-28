import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import SacramentService from '#services/sacrament_service'

@inject()
export default class SacramentController {
    constructor(protected sacramentService: SacramentService) { }

    /**
     * @index
     * @description List all sacraments
     * @showSummary true
     */
    async index() {
        return this.sacramentService.all()
    }

    /**
     * @show
     * @description Display a single sacrament
     * @showSummary true
     * @paramPath id - Sacrament ID - Example: 1
     */
    async show({ params }: HttpContext) {
        return this.sacramentService.find(params.id)
    }

    /**
     * @store
     * @description Register a new sacrament
     * @showSummary true
     * @requestBody <Sacrament>
     */
    async store({ bouncer, request }: HttpContext) {
        await bouncer.with('SacramentPolicy').authorize('handle')
        const data = request.all()
        return this.sacramentService.create(data)
    }

    /**
     * @update
     * @description Update sacrament details
     * @showSummary true
     * @paramPath id - Sacrament ID - Example: 1
     * @requestBody <Sacrament>
     */
    async update({ bouncer, params, request }: HttpContext) {
        await bouncer.with('SacramentPolicy').authorize('handle')
        const data = request.all()
        return this.sacramentService.update(params.id, data)
    }

    /**
     * @destroy
     * @description Delete a sacrament
     * @showSummary true
     * @paramPath id - Sacrament ID - Example: 1
     */
    async destroy({ bouncer, params, response }: HttpContext) {
        await bouncer.with('SacramentPolicy').authorize('handle')
        await this.sacramentService.delete(params.id)
        return response.noContent()
    }

    /**
     * @agenda
     * @description View the priest's sacrament agenda
     * @showSummary true
     * @paramPath priestId - Priest (User) ID - Example: 1
     * @paramQuery date - Specific date to filter (YYYY-MM-DD) - Example: 2024-05-20
     */
    async agenda({ bouncer, params, request, response }: HttpContext) {
        const priestId = params.priestId || request.input('priestId')

        if (!priestId) {
            return response.badRequest({ error: 'priestId is required' })
        }

        if (await bouncer.with('SacramentPolicy').denies('viewAgenda', priestId)) {
            return response.forbidden({ error: 'You are not authorized to view this agenda' })
        }

        const date = request.input('date')
        return this.sacramentService.getAgenda(priestId, date)
    }
}
