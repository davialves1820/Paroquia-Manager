import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'attendances'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('catechism_student_id').unsigned().references('id').inTable('catechism_students').onDelete('CASCADE').nullable()
      table.integer('member_id').unsigned().nullable().alter()
    })
  }

  async down() {
    // Para voltar, precisamos garantir que não existam registros sem member_id
    // ou simplesmente deletar as presenças de catequese que não existiam antes.
    await this.db.rawQuery('DELETE FROM "attendances" WHERE "member_id" IS NULL')

    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('catechism_student_id')
      table.integer('member_id').unsigned().notNullable().alter()
    })
  }
}