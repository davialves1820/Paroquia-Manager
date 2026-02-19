import { HttpContext } from '@adonisjs/core/http'
import Pastoral from '#models/pastoral'
import NotificationService from '#services/notification_service'
import { inject } from '@adonisjs/core'

@inject()
export default class PastoralNoticesController {
    constructor(protected notificationService: NotificationService) { }

    /**
     * Mandar aviso para todos os membros de uma pastoral
     */
    async sendToPastoral({ params, request, response, bouncer }: HttpContext) {
        const pastoral = await Pastoral.findOrFail(params.id)

        // Segurança: Apenas quem pode gerenciar a pastoral (Coordenador dela, Padre ou Admin)
        await bouncer.with('PastoralEventPolicy').authorize('manage', pastoral)

        const { title, message } = request.only(['title', 'message'])

        await this.notificationService.sendToPastoral(pastoral.id, title, message)

        return response.ok({ message: 'Aviso enviado para os membros da pastoral com sucesso.' })
    }

    /**
     * Mandar aviso geral para toda a paróquia (Apenas Padre ou Admin)
     */
    async sendToAll({ request, response, bouncer }: HttpContext) {
        // Segurança: Apenas Padre ou Admin
        await bouncer.with('PastoralEventPolicy').authorize('sendGlobal')

        const { title, message } = request.only(['title', 'message'])

        await this.notificationService.sendToAll(title, message)

        return response.ok({ message: 'Aviso geral enviado com sucesso.' })
    }
}