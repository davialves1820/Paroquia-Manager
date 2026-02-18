// app/models/donation.ts
import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
} from '@adonisjs/lucid/orm'
import Member from './member.js'

export type PaymentMethod =
  | 'DINHEIRO'
  | 'PIX'
  | 'CARTAO'
  | 'TRANSFERENCIA'

export default class Donation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare memberId: number

  @column()
  declare value: number

  @column.date()
  declare paymentDate: DateTime

  @column()
  declare method: PaymentMethod

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // 🔁 RELACIONAMENTO

  @belongsTo(() => Member)
  declare member: BelongsTo<typeof Member>
}
