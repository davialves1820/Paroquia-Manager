// app/models/sacrament.ts
import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
} from '@adonisjs/lucid/orm'
import Member from './member.js'
import User from './user.js'

export type SacramentType =
  | 'BATISMO'
  | 'CRISMA'
  | 'CASAMENTO'

export default class Sacrament extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare memberId: number

  @column()
  declare priestId: number

  @column()
  declare type: SacramentType

  @column.date()
  declare date: DateTime

  @column()
  declare certificateUrl: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // 🔁 RELACIONAMENTOS

  @belongsTo(() => Member)
  declare member: BelongsTo<typeof Member>

  @belongsTo(() => User, {
    foreignKey: 'priestId',
  })
  declare priest: BelongsTo<typeof User>
}
