import Sacrament from './sacrament.js'
import CatechismClass from './catechism_class.js'
import Notification from './notification.js'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Pastoral from './pastoral.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export type UserRole =
  | 'ADMIN'
  | 'PADRE'
  | 'SECRETARIA'
  | 'COORDENADOR'
  | 'CATEQUISTA'
  | 'FIEL'

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: UserRole

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null


  // 🔁 RELACIONAMENTOS

  @hasMany(() => Sacrament, {
    foreignKey: 'priestId',
  })
  declare sacraments: HasMany<typeof Sacrament>

  @hasMany(() => CatechismClass, {
    foreignKey: 'catechistId',
  })
  declare catechismClasses: HasMany<typeof CatechismClass>

  @hasMany(() => Notification)
  declare notifications: HasMany<typeof Notification>

  @manyToMany(() => Pastoral, {
    pivotTable: 'pastoral_users',
  })
  declare pastorals: ManyToMany<typeof Pastoral>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}