import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'donations'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('member_id').unsigned().references('id').inTable('members').onDelete('CASCADE')
            table.decimal('value', 12, 2).notNullable()
            table.date('payment_date').notNullable()
            table.string('method').notNullable()

            table.timestamp('created_at')
            table.timestamp('updated_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
