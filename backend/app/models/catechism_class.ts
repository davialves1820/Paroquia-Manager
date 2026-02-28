// app/models/catechism_class.ts
import { DateTime } from '../../node_modules/@types/luxon/index.js'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import CatechismEnrollment from './catechism_enrollment.js'
import Attendance from './attendance.js'

export default class CatechismClass extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare year: number

  @column()
  declare catechistId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // 🔁 RELACIONAMENTOS

  @belongsTo(() => User, {
    foreignKey: 'catechistId',
  })
  declare catechist: BelongsTo<typeof User>

  @hasMany(() => CatechismEnrollment, {
    foreignKey: 'classId',
  })
  declare enrollments: HasMany<typeof CatechismEnrollment>

  @hasMany(() => Attendance, {
    foreignKey: 'classId',
  })
  declare attendances: HasMany<typeof Attendance>
}
