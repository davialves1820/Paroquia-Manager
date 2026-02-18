// app/models/attendance.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import CatechismClass from './catechism_class.js'
import Member from './member.js'

export default class Attendance extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare classId: number

  @column()
  declare memberId: number

  @column.date()
  declare date: DateTime

  @column()
  declare present: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // 🔁 RELACIONAMENTOS

  @belongsTo(() => CatechismClass, {
    foreignKey: 'classId',
  })
  declare catechismClass: BelongsTo<typeof CatechismClass>

  @belongsTo(() => Member)
  declare member: BelongsTo<typeof Member>
}
