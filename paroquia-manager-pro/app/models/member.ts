// app/models/member.ts
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Donation from './donation.js'
import Sacrament from './sacrament.js'
import CatechismEnrollment from './catechism_enrollment.js'
import Attendance from './attendance.js'
import Pastoral from './pastoral.js'

export default class Member extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column.date()
  declare birthDate: DateTime | null

  @column()
  declare phone: string | null

  @column()
  declare address: string | null

  @column()
  declare baptized: boolean

  @column()
  declare confirmed: boolean

  @column()
  declare married: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // 🔁 RELACIONAMENTOS

  @hasMany(() => Donation)
  declare donations: HasMany<typeof Donation>

  @hasMany(() => Sacrament)
  declare sacraments: HasMany<typeof Sacrament>

  @hasMany(() => CatechismEnrollment)
  declare enrollments: HasMany<typeof CatechismEnrollment>

  @hasMany(() => Attendance)
  declare attendances: HasMany<typeof Attendance>

  @manyToMany(() => Pastoral, {
    pivotTable: 'pastoral_members',
  })
  declare pastorals: ManyToMany<typeof Pastoral>
}
