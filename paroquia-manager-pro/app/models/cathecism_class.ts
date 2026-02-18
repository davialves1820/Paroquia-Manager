// app/models/catechism_class.ts
import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  hasMany,
  BelongsTo,
  HasMany,
} from '@adonisjs/lucid/orm'
import User from './user.js'
import CatechismEnrollment from './cathecism_enrollement.js'
import Attendance from './attendence.js'

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
