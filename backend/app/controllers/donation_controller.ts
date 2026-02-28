import { DateTime } from 'luxon'
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import DonationService from '#services/donation_service'

@inject()
export default class DonationController {
    constructor(protected donationService: DonationService) { }

    async index() {
        return this.donationService.all()
    }

    async store({ request }: HttpContext) {
        const data = request.all()
        return this.donationService.create(data)
    }

    async monthlyReport({ request }: HttpContext) {
        const month = request.input('month', DateTime.now().month)
        const year = request.input('year', DateTime.now().year)
        return this.donationService.getMonthlyReport(Number(month), Number(year))
    }

    async yearlyReport({ request }: HttpContext) {
        const year = request.input('year', DateTime.now().year)
        return this.donationService.getYearlyReport(Number(year))
    }
}
