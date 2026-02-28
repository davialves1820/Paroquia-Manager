import { DateTime } from '../../node_modules/@types/luxon/index.js'
import { BaseModel, column, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import Member from './member.js'
import User from './user.js'
import PastoralEvent from './pastoral_event.js'

export default class Pastoral extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Member, {
    pivotTable: 'pastoral_members',
  })
  declare members: ManyToMany<typeof Member>

  @manyToMany(() => User, {
    pivotTable: 'pastoral_users',
  })
  declare coordinators: ManyToMany<typeof User>

  @hasMany(() => PastoralEvent)
  declare events: HasMany<typeof PastoralEvent>
}