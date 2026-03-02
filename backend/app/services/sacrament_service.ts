import Sacrament from '#models/sacrament'
import PDFDocument from 'pdfkit'
import { inject } from '@adonisjs/core'
import NotificationService from '#services/notification_service'
import fs from 'node:fs'
import path from 'node:path'

@inject()
export default class SacramentService {
  constructor(protected notificationService: NotificationService) {}

  async all() {
    return await Sacrament.query().preload('member').preload('priest')
  }

  async create(data: any) {
    const sacrament = await Sacrament.create(data)

    // Carrega as relações para o certificado
    await sacrament.load('member')
    await sacrament.load('priest')

    const pdfUrl = await this.generateCertificate(sacrament)
    sacrament.certificateUrl = pdfUrl
    await sacrament.save()

    // Notifica o coordenador (ou administrador)
    // Por agora, vamos simular que o padre recebe a notificação
    await this.notificationService.create({
      userId: sacrament.priestId,
      title: 'Novo Sacramento Registrado',
      message: `O sacramento de ${sacrament.type} para ${sacrament.member.name} foi registrado.`,
    })

    return sacrament
  }

  async find(id: number) {
    return await Sacrament.query().where('id', id).preload('member').preload('priest').firstOrFail()
  }

  async generateCertificate(sacrament: Sacrament): Promise<string> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', layout: 'landscape' })
      const fileName = `certificate_${sacrament.id}_${Date.now()}.pdf`
      const filePath = path.join(process.cwd(), 'tmp', 'uploads', fileName)

      // Garantir que a pasta existe
      fs.mkdirSync(path.dirname(filePath), { recursive: true })

      const stream = fs.createWriteStream(filePath)
      doc.pipe(stream)

      // Estilização do Certificado
      doc.fontSize(30).text('Certificado de Sacramento', { align: 'center' })
      doc.moveDown()
      doc.fontSize(20).text(`Paróquia Manager Pro`, { align: 'center' })
      doc.moveDown(2)

      doc
        .fontSize(16)
        .text(
          `Certificamos que ${sacrament.member.name} recebeu o sacramento de ${sacrament.type.toUpperCase()} no dia ${sacrament.date.toFormat('dd/MM/yyyy')}.`,
          { align: 'center' }
        )

      doc.moveDown(2)
      doc.fontSize(14).text(`Padre: ${sacrament.priest.fullName}`, { align: 'center' })

      doc.end()

      stream.on('finish', () => resolve(`/uploads/${fileName}`))
      stream.on('error', (err) => reject(err))
    })
  }

  async update(id: number, data: any) {
    const sacrament = await Sacrament.findOrFail(id)
    sacrament.merge(data)
    await sacrament.save()

    // Recalcula o certificado se necessário (se data, tipo ou membro mudaram)
    // Por simplificação, vamos regenerar se houver mudança
    await sacrament.load('member')
    await sacrament.load('priest')
    const pdfUrl = await this.generateCertificate(sacrament)
    sacrament.certificateUrl = pdfUrl
    await sacrament.save()

    return sacrament
  }

  async getAgenda(priestId: number, date?: string) {
    const query = Sacrament.query().where('priestId', priestId).preload('member').preload('priest')

    if (date) {
      query.where('date', date)
    }

    return await query.orderBy('date', 'asc')
  }

  async delete(id: number) {
    const sacrament = await Sacrament.findOrFail(id)
    await sacrament.delete()
  }
}
