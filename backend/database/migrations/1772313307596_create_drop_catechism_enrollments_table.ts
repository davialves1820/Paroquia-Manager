import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'catechism_enrollments'

  async up() {
    this.schema.dropTable(this.tableName)
  }

  async down() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('class_id').unsigned().references('id').inTable('catechism_classes').onDelete('CASCADE')
      table.integer('member_id').unsigned().references('id').inTable('members').onDelete('CASCADE')
      table.timestamp('enrolled_at')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }
}