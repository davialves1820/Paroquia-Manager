import Donation from '#models/donation'
import { DateTime } from 'luxon'

export default class DonationService {
  async all() {
    return await Donation.query().preload('member')
  }

  async create(data: any) {
    return await Donation.create(data)
  }

  async getMonthlyReport(month: number, year: number) {
    const start = DateTime.fromObject({ year, month, day: 1 }).startOf('day')
    const end = start.endOf('month')

    const donations = await Donation.query()
      .whereBetween('payment_date', [start.toISODate()!, end.toISODate()!])
      .preload('member')

    const total = donations.reduce((sum, d) => sum + Number(d.value), 0)

    return {
      donations,
      total,
      period: start.toFormat('MMMM yyyy'),
    }
  }

  async getYearlyReport(year: number) {
    const start = DateTime.fromObject({ year, month: 1, day: 1 }).startOf('day')
    const end = start.endOf('year')

    const donations = await Donation.query().whereBetween('payment_date', [
      start.toISODate()!,
      end.toISODate()!,
    ])

    const total = donations.reduce((sum, d) => sum + Number(d.value), 0)

    return {
      total,
      year,
    }
  }
}
