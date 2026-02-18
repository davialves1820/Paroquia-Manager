import Notification from '#models/notification'

export default class NotificationService {
    async create(data: { userId: number; title: string; message: string }) {
        return await Notification.create({
            ...data,
            read: false,
        })
    }

    async markAsRead(id: number) {
        const notification = await Notification.findOrFail(id)
        notification.read = true
        await notification.save()
        return notification
    }

    async getUserNotifications(userId: number) {
        return await Notification.query()
            .where('userId', userId)
            .orderBy('createdAt', 'desc')
    }

    async getUnreadCount(userId: number) {
        const counts = await Notification.query()
            .where('userId', userId)
            .where('read', false)
            .count('* as total')

        return Number(counts[0].$extras.total)
    }
}
