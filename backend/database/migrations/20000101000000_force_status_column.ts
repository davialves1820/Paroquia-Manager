import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'attendances'

    async up() {

        this.schema.alterTable(this.tableName, (table) => {
            table.integer('class_id').nullable().alter()

            table.integer('pastoral_event_id')
                .unsigned()
                .nullable()
                .alter()
        })

        // cria FK somente se não existir
        this.schema.raw(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conname = 'attendances_pastoral_event_id_foreign'
        ) THEN
          ALTER TABLE attendances
          ADD CONSTRAINT attendances_pastoral_event_id_foreign
          FOREIGN KEY (pastoral_event_id)
          REFERENCES pastoral_events(id)
          ON DELETE CASCADE;
        END IF;
      END $$;
    `)
    }

    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('pastoral_event_id')
            table.integer('class_id').notNullable().alter()
        })
    }
}