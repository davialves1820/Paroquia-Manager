import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import CatechismClass from './catechism_class.js'
import Attendance from './attendance.js'

export default class CatechismStudent extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare classId: number

  @column()
  declare status: 'ACTIVE' | 'COMPLETED' | 'DROPPED'

  @column()
  declare hasBaptism: boolean

  @column()
  declare hasFirstEucharist: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // 🔁 RELACIONAMENTOS

  @belongsTo(() => CatechismClass, {
    foreignKey: 'classId',
  })
  declare catechismClass: BelongsTo<typeof CatechismClass>

  @hasMany(() => Attendance, {
    foreignKey: 'catechismStudentId',
  })
  declare attendances: HasMany<typeof Attendance>
}
