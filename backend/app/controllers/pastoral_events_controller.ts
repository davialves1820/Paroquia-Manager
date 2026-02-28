import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import Pastoral from '#models/pastoral'
import PastoralEvent from '#models/pastoral_event'
import { DateTime } from '../../node_modules/@types/luxon/index.js'
import AttendanceService from '#services/attendance_service'

@inject()
export default class PastoralEventsController {
    constructor(protected attendanceService: AttendanceService) { }

    /**
     * Listar eventos de uma pastoral específica
     */
    async index({ params, response }: HttpContext) {
        const pastoral = await Pastoral.findOrFail(params.id)
        const events = await pastoral.related('events').query().orderBy('date', 'asc')
        return response.ok(events)
    }

    /**
     * Descrição: Criar um novo evento/encontro para a pastoral
     */
    async store({ params, request, response, bouncer }: HttpContext) {
        const pastoral = await Pastoral.findOrFail(params.id)

        // Verificar se o usuário tem permissão (ADMIN, PADRE ou COORDENADOR daquela pastoral)
        await bouncer.with('PastoralEventPolicy').authorize('manage', pastoral)

        const data = request.only(['title', 'description', 'date', 'location'])

        const event = await pastoral.related('events').create({
            ...data,
            date: DateTime.fromISO(data.date),
        })

        return response.created(event)
    }

    /**
     * Editar um evento existente
     */
    async update({ params, request, response, bouncer }: HttpContext) {
        const event = await PastoralEvent.findOrFail(params.id)
        const pastoral = await Pastoral.findOrFail(event.pastoralId)

        await bouncer.with('PastoralEventPolicy').authorize('manage', pastoral)

        const data = request.only(['title', 'description', 'date', 'location'])

        if (data.date) {
            data.date = DateTime.fromISO(data.date) as any
        }

        event.merge(data)
        await event.save()

        return response.ok(event)
    }

    /**
     * Excluir um evento
     */
    async destroy({ params, response, bouncer }: HttpContext) {
        const event = await PastoralEvent.findOrFail(params.id)
        const pastoral = await Pastoral.findOrFail(event.pastoralId)

        await bouncer.with('PastoralEventPolicy').authorize('manage', pastoral)

        await event.delete()

        return response.noContent()
    }

    /**
     * Marcar presença em um evento de pastoral
     */
    async attendance({ params, request, response, bouncer }: HttpContext) {
        const event = await PastoralEvent.findOrFail(params.eventId)
        const pastoral = await Pastoral.findOrFail(event.pastoralId)

        await bouncer.with('PastoralEventPolicy').authorize('manage', pastoral)

        const { memberId, present } = request.only(['memberId', 'present'])

        const attendance = await this.attendanceService.markPastoralAttendance({
            pastoralEventId: event.id,
            memberId,
            date: event.date.toISODate()!,
            present: present ?? true,
        })

        return response.ok(attendance)
    }
}