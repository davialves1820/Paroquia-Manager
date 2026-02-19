import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pastoral_events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('pastoral_id').unsigned().references('id').inTable('pastorals').onDelete('CASCADE').notNullable()
      table.string('title').notNullable()
      table.text('description').nullable()
      table.timestamp('date').notNullable()
      table.string('location').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}