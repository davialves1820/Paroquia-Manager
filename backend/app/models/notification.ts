// app/models/notification.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare title: string

  @column()
  declare message: string

  @column()
  declare read: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // 🔁 RELACIONAMENTO

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
