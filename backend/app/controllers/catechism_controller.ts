import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import CatechismService from '#services/catechism_service'

@inject()
export default class CatechismController {
    constructor(protected catechismService: CatechismService) { }

    async storeClass({ request }: HttpContext) {
        const data = request.all()
        return this.catechismService.createClass(data)
    }

    async enroll({ request }: HttpContext) {
        const data = request.only(['classId', 'memberId'])
        return this.catechismService.enroll(data as any)
    }

    async attendance({ request }: HttpContext) {
        const data = request.only(['classId', 'memberId', 'date', 'present'])
        return this.catechismService.markAttendance(data as any)
    }

    async show({ params }: HttpContext) {
        return this.catechismService.getClassDetails(params.id)
    }

    async frequency({ params }: HttpContext) {
        const freq = await this.catechismService.calculateFrequency(params.classId, params.memberId)
        return { frequency: freq }
    }
}
