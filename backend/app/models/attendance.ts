// app/models/attendance.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import CatechismClass from './catechism_class.js'
import PastoralEvent from './pastoral_event.js'
import Member from './member.js'
import CatechismStudent from './catechism_student.js'

export default class Attendance extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare classId: number | null

  @column()
  declare pastoralEventId: number | null

  @column()
  declare memberId: number | null

  @column()
  declare catechismStudentId: number | null

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

  @belongsTo(() => PastoralEvent, {
    foreignKey: 'pastoralEventId',
  })
  declare pastoralEvent: BelongsTo<typeof PastoralEvent>

  @belongsTo(() => Member)
  declare member: BelongsTo<typeof Member>

  @belongsTo(() => CatechismStudent, {
    foreignKey: 'catechismStudentId',
  })
  declare catechismStudent: BelongsTo<typeof CatechismStudent>
}
