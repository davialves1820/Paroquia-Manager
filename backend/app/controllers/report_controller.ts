import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ReportService from '#services/report_service'

@inject()
export default class ReportController {
  constructor(protected reportService: ReportService) {}

  async members({ response }: HttpContext) {
    const buffer = await this.reportService.generateMembersExcel()
    response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response.header('Content-Disposition', 'attachment; filename=fieis.xlsx')
    return response.send(buffer)
  }

  async donations({ request, response }: HttpContext) {
    const { month, year } = request.qs()
    const buffer = await this.reportService.generateDonationsExcel(
      month ? Number(month) : undefined,
      year ? Number(year) : undefined
    )
    response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response.header('Content-Disposition', 'attachment; filename=dizimos.xlsx')
    return response.send(buffer)
  }

  async sacraments({ request, response }: HttpContext) {
    const { type } = request.qs()
    const buffer = await this.reportService.generateSacramentsExcel(type)
    response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response.header('Content-Disposition', 'attachment; filename=sacramentos.xlsx')
    return response.send(buffer)
  }
}
