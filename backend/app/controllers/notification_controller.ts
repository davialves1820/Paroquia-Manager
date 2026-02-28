import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import NotificationService from '#services/notification_service'

@inject()
export default class NotificationController {
    constructor(protected notificationService: NotificationService) { }

    async index({ auth, response }: HttpContext) {
        const user = auth.user!
        const notifications = await this.notificationService.getUserNotifications(user.id)
        return response.ok(notifications)
    }

    async unreadCount({ auth, response }: HttpContext) {
        const user = auth.user!
        const count = await this.notificationService.getUnreadCount(user.id)
        return response.ok({ count })
    }

    async markAsRead({ params, response }: HttpContext) {
        const notification = await this.notificationService.markAsRead(params.id)
        return response.ok(notification)
    }
}
