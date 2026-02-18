// app/models/catechism_enrollment.ts
import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
} from '@adonisjs/lucid/orm'
import CatechismClass from './cathecism_class.js'
import Member from './member.js'

export default class CatechismEnrollment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare classId: number

  @column()
  declare memberId: number

  @column.dateTime({ autoCreate: true })
  declare enrolledAt: DateTime

  // 🔁 RELACIONAMENTOS

  @belongsTo(() => CatechismClass, {
    foreignKey: 'classId',
  })
  declare catechismClass: BelongsTo<typeof CatechismClass>

  @belongsTo(() => Member)
  declare member: BelongsTo<typeof Member>
}
