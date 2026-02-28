// app/models/donation.ts
import { DateTime } from '../../node_modules/@types/luxon/index.js'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
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
