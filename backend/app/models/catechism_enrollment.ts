// app/models/catechism_enrollment.ts
import { DateTime } from '../../node_modules/@types/luxon/index.js'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import CatechismClass from './catechism_class.js'
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
