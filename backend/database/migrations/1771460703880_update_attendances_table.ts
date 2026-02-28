import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'attendances'

    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.setNullable('class_id')
            table.integer('pastoral_event_id').unsigned().references('id').inTable('pastoral_events').onDelete('CASCADE').nullable()
        })
    }

    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropNullable('class_id')
            table.dropColumn('pastoral_event_id')
        })
    }
}
