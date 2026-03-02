import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'catechism_students'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('has_baptism').defaultTo(false).notNullable()
      table.boolean('has_first_eucharist').defaultTo(false).notNullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('has_baptism')
      table.dropColumn('has_first_eucharist')
    })
  }
}
