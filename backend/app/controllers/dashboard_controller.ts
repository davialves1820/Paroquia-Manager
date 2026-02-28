import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import DashboardService from '#services/dashboard_service'

@inject()
export default class DashboardController {
    constructor(protected dashboardService: DashboardService) { }

    async index({ response }: HttpContext) {
        const metrics = await this.dashboardService.getMetrics()
        return response.ok(metrics)
    }
}
