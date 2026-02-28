import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'catechism_students'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.integer('class_id').unsigned().references('id').inTable('catechism_classes').onDelete('CASCADE')
      table.enum('status', ['ACTIVE', 'COMPLETED', 'DROPPED']).defaultTo('ACTIVE').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}