import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import CatechismService from '#services/catechism_service'

@inject()
export default class CatechismController {
    constructor(protected catechismService: CatechismService) { }

    async index() {
        return this.catechismService.listClasses()
    }

    async storeClass({ request }: HttpContext) {
        const data = request.all()
        return this.catechismService.createClass(data)
    }

    async addStudent({ request }: HttpContext) {
        const data = request.only(['classId', 'name', 'hasBaptism', 'hasFirstEucharist'])
        return this.catechismService.addStudent(data as any)
    }

    async updateStudent({ params, request }: HttpContext) {
        const data = request.only(['name', 'hasBaptism', 'hasFirstEucharist', 'status'])
        return this.catechismService.updateStudent(params.id, data as any)
    }

    async removeStudent({ params }: HttpContext) {
        return this.catechismService.removeStudent(params.studentId)
    }

    async attendance({ request }: HttpContext) {
        const data = request.only(['classId', 'studentId', 'date', 'present'])
        return this.catechismService.markAttendance(data as any)
    }

    async show({ params }: HttpContext) {
        return this.catechismService.getClassDetails(params.id)
    }

    async frequency({ params }: HttpContext) {
        const freq = await this.catechismService.calculateFrequency(params.classId, params.studentId)
        return { frequency: freq }
    }

    async metrics({ request }: HttpContext) {
        const year = request.input('year')
        return this.catechismService.getMetrics(year ? parseInt(year) : undefined)
    }

    async missingSacraments() {
        return this.catechismService.getStudentsMissingSacraments()
    }

    async toggleMeeting({ request }: HttpContext) {
        const { classId, date, occurred } = request.only(['classId', 'date', 'occurred'])
        return this.catechismService.toggleMeeting(classId, date, occurred)
    }

    async meetingStatus({ request }: HttpContext) {
        const { classId, date } = request.all()
        return this.catechismService.getMeetingStatus(classId, date)
    }
}
