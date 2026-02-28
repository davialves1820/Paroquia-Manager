import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'catechism_students'

    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.enum('status', ['ACTIVE', 'COMPLETED', 'DROPPED']).defaultTo('ACTIVE').notNullable()
        })
    }

    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('status')
        })
    }
}
