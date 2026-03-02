import Notification from '#models/notification'
import User from '#models/user'
import Pastoral from '#models/pastoral'

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
    return await Notification.query().where('userId', userId).orderBy('createdAt', 'desc')
  }

  async getUnreadCount(userId: number) {
    const counts = await Notification.query()
      .where('userId', userId)
      .where('read', false)
      .count('* as total')

    return Number(counts[0].$extras.total)
  }

  async sendToPastoral(pastoralId: number, title: string, message: string) {
    const pastoral = await Pastoral.query().where('id', pastoralId).preload('members').firstOrFail()

    const notifications = pastoral.members
      .filter((member) => member.userId)
      .map((member) => ({
        userId: member.userId!,
        title,
        message,
        read: false,
      }))

    if (notifications.length > 0) {
      await Notification.createMany(notifications)
    }
  }

  async sendToAll(title: string, message: string) {
    const users = await User.all()
    const notifications = users.map((user) => ({
      userId: user.id,
      title,
      message,
      read: false,
    }))

    await Notification.createMany(notifications)
  }
}
