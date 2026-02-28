import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'catechism_classes'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('name').notNullable()
            table.integer('year').notNullable()
            table.integer('catechist_id').unsigned().references('id').inTable('users').onDelete('SET NULL')

            table.timestamp('created_at')
            table.timestamp('updated_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
