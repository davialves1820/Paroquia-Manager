import Member from '#models/member'
import Donation from '#models/donation'
import Sacrament from '#models/sacrament'
import Attendance from '#models/attendance'
import { DateTime } from '../../node_modules/@types/luxon/index.js'

export default class DashboardService {
    async getMetrics() {
        const now = DateTime.now()
        const firstDayOfMonth = now.startOf('month')

        const totalMembers = await Member.query().count('* as total')

        const monthlyDonations = await Donation.query()
            .whereBetween('payment_date', [firstDayOfMonth.toISODate()!, now.toISODate()!])
            .sum('value as total')

        const sacramentsByType = await Sacrament.query()
            .select('type')
            .count('* as total')
            .groupBy('type')

        const averageAttendance = await Attendance.query()
            .select('present')
            .count('* as total')
            .groupBy('present')

        const growth = await Member.query()
            .whereBetween('created_at', [now.minus({ months: 1 }).toSQL()!, now.toSQL()!])
            .count('* as total')

        return {
            totalMembers: Number(totalMembers[0].$extras.total),
            monthlyArrecadacao: Number(monthlyDonations[0].$extras.total || 0),
            sacramentsByType: sacramentsByType.map(s => ({ type: s.type, total: Number(s.$extras.total) })),
            averageAttendance: this.calculateAttendancePercentage(averageAttendance),
            monthlyGrowth: Number(growth[0].$extras.total)
        }
    }

    private calculateAttendancePercentage(data: any[]) {
        const present = data.find(d => d.present === true)?.$extras.total || 0
        const total = data.reduce((acc, d) => acc + Number(d.$extras.total), 0)
        return total > 0 ? (Number(present) / total) * 100 : 0
    }
}
