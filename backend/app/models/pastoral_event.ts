import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Pastoral from './pastoral.js'
import Attendance from './attendance.js'

export default class PastoralEvent extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare pastoralId: number

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column.dateTime()
  declare date: DateTime

  @column()
  declare location: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Pastoral)
  declare pastoral: BelongsTo<typeof Pastoral>

  @hasMany(() => Attendance)
  declare attendances: HasMany<typeof Attendance>
}
