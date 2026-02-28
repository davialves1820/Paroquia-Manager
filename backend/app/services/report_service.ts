import ExcelJS from 'exceljs'
import Member from '#models/member'
import Donation from '#models/donation'
import Sacrament from '#models/sacrament'
import { DateTime } from 'luxon'

export default class ReportService {
    async generateMembersExcel() {
        const members = await Member.all()
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Fiéis')

        worksheet.columns = [
            { header: 'Nome', key: 'name', width: 30 },
            { header: 'Data de Nascimento', key: 'birthDate', width: 20 },
            { header: 'Telefone', key: 'phone', width: 15 },
            { header: 'Endereço', key: 'address', width: 30 },
            { header: 'Batizado', key: 'baptized', width: 10 },
            { header: 'Crismado', key: 'confirmed', width: 10 },
            { header: 'Casado', key: 'married', width: 10 },
        ]

        members.forEach((member) => {
            worksheet.addRow({
                name: member.name,
                birthDate: member.birthDate ? member.birthDate.toISODate() : 'N/A',
                phone: member.phone || 'N/A',
                address: member.address || 'N/A',
                baptized: member.baptized ? 'Sim' : 'Não',
                confirmed: member.confirmed ? 'Sim' : 'Não',
                married: member.married ? 'Sim' : 'Não',
            })
        })

        return await workbook.xlsx.writeBuffer()
    }

    async generateDonationsExcel(month?: number, year?: number) {
        let query = Donation.query().preload('member')

        if (month && year) {
            const start = DateTime.fromObject({ year, month, day: 1 }).startOf('day')
            const end = start.endOf('month')
            query = query.whereBetween('payment_date', [start.toISODate()!, end.toISODate()!])
        }

        const donations = await query
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Dízimos')

        worksheet.columns = [
            { header: 'Fiel', key: 'memberName', width: 30 },
            { header: 'Valor', key: 'value', width: 15 },
            { header: 'Data do Pagamento', key: 'paymentDate', width: 20 },
            { header: 'Método', key: 'method', width: 15 },
        ]

        donations.forEach((donation) => {
            worksheet.addRow({
                memberName: donation.member.name,
                value: donation.value,
                paymentDate: donation.paymentDate.toISODate(),
                method: donation.method,
            })
        })

        return await workbook.xlsx.writeBuffer()
    }

    async generateSacramentsExcel(type?: string) {
        let query = Sacrament.query().preload('member').preload('priest')

        if (type) {
            query = query.where('type', type)
        }

        const sacraments = await query
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Sacramentos')

        worksheet.columns = [
            { header: 'Fiel', key: 'memberName', width: 30 },
            { header: 'Tipo', key: 'type', width: 15 },
            { header: 'Data', key: 'date', width: 20 },
            { header: 'Padre', key: 'priestName', width: 30 },
        ]

        sacraments.forEach((sac) => {
            worksheet.addRow({
                memberName: sac.member.name,
                type: sac.type,
                date: sac.date.toISODate(),
                priestName: sac.priest.fullName,
            })
        })

        return await workbook.xlsx.writeBuffer()
    }
}
