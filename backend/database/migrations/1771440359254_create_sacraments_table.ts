import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sacraments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('member_id').unsigned().references('id').inTable('members').onDelete('CASCADE')
      table.integer('priest_id').unsigned().references('id').inTable('users').onDelete('SET NULL')
      table.string('type').notNullable() // Batismo, Crisma, Casamento
      table.date('date').notNullable()
      table.string('certificate_url').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
