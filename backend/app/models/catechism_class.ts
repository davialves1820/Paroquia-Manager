// app/models/catechism_class.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import CatechismStudent from './catechism_student.js'
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

  @hasMany(() => CatechismStudent, {
    foreignKey: 'classId',
  })
  declare students: HasMany<typeof CatechismStudent>

  @hasMany(() => Attendance, {
    foreignKey: 'classId',
  })
  declare attendances: HasMany<typeof Attendance>
}
