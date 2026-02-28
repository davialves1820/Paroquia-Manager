import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Member from '#models/member'
import Pastoral from '#models/pastoral'
import Donation from '#models/donation'
import Sacrament from '#models/sacrament'
import CatechismClass from '#models/catechism_class'
import CatechismEnrollment from '#models/catechism_enrollment'
import Attendance from '#models/attendance'
import { DateTime } from '../../node_modules/@types/luxon/index.js'

export default class MainSeeder extends BaseSeeder {
  async run() {
    // 1. USUÁRIOS
    const users = await User.createMany([
      { fullName: 'Administrador Sistema', email: 'admin@email.com', password: 'senha_segura', role: 'ADMIN' },
      { fullName: 'Padre Antônio', email: 'padre@email.com', password: 'senha_segura', role: 'PADRE' },
      { fullName: 'Secretária Maria', email: 'secretaria@email.com', password: 'senha_segura', role: 'SECRETARIA' },
      { fullName: 'Coordenadora Julia', email: 'coordenador@email.com', password: 'senha_segura', role: 'COORDENADOR' },
      { fullName: 'Fiel Exemplo', email: 'fiel@email.com', password: 'senha_segura', role: 'FIEL' },
    ])

    const padreId = users[1].id
    const coordenadoraId = users[3].id

    // 2. FIÉIS (MEMBROS)
    const membersData = [
      { name: 'João da Silva', birthDate: DateTime.fromISO('1985-06-12'), baptized: true, confirmed: true, married: true },
      { name: 'Maria Oliveira', birthDate: DateTime.fromISO('1992-03-25'), baptized: true, confirmed: true, married: false },
      { name: 'Pedro Santos', birthDate: DateTime.fromISO('2010-08-05'), baptized: true, confirmed: false, married: false },
      { name: 'Ana Costa', birthDate: DateTime.fromISO('1978-11-30'), baptized: true, confirmed: true, married: true },
      { name: 'Lucas Ferreira', birthDate: DateTime.fromISO('2005-01-15'), baptized: true, confirmed: true, married: false },
      { name: 'Carla Souza', birthDate: DateTime.fromISO('1995-09-20'), baptized: true, confirmed: false, married: false },
      { name: 'Marcos Lima', birthDate: DateTime.fromISO('1988-07-08'), baptized: true, confirmed: true, married: true },
      { name: 'Juliana Pires', birthDate: DateTime.fromISO('1990-12-12'), baptized: true, confirmed: true, married: true },
      { name: 'Roberto Rocha', birthDate: DateTime.fromISO('1982-04-18'), baptized: true, confirmed: true, married: false },
      { name: 'Fernanda Alves', birthDate: DateTime.fromISO('1998-02-22'), baptized: true, confirmed: false, married: false },
    ]

    const members = await Member.createMany(membersData)

    // 3. PASTORAIS
    const pastorals = await Pastoral.createMany([
      { name: 'Pastoral da Juventude', description: 'Atividades para jovens da comunidade' },
      { name: 'Pastoral do Batismo', description: 'Preparação para pais e padrinhos' },
      { name: 'Catequese', description: 'Formação cristã para crianças e adultos' },
      { name: 'Pastoral do Dízimo', description: 'Conscientização sobre a partilha' },
      { name: 'Pastoral Familiar', description: 'Apoio às famílias da paróquia' },
    ])

    // Vínculos das Pastorais
    await pastorals[0].related('members').attach([members[2].id, members[4].id, members[9].id])
    await pastorals[0].related('coordinators').attach([coordenadoraId])
    await pastorals[2].related('members').attach([members[2].id, members[5].id])

    // 4. DOAÇÕES (Últimos 3 meses)
    const now = DateTime.now()
    const methods = ['PIX', 'DINHEIRO', 'CARTAO', 'TRANSFERENCIA'] as const

    for (const member of members) {
      for (let i = 0; i < 3; i++) {
        const date = now.minus({ months: i }).set({ day: 10 })
        await Donation.create({
          memberId: member.id,
          value: Math.floor(Math.random() * (200 - 30 + 1) + 30),
          paymentDate: date,
          method: methods[Math.floor(Math.random() * methods.length)],
        })
      }
    }

    // 5. SACRAMENTOS
    await Sacrament.createMany([
      { memberId: members[2].id, priestId: padreId, type: 'BATISMO', date: DateTime.fromISO('2011-05-20') },
      { memberId: members[5].id, priestId: padreId, type: 'BATISMO', date: DateTime.fromISO('1996-01-10') },
      { memberId: members[0].id, priestId: padreId, type: 'CASAMENTO', date: DateTime.fromISO('2015-10-05') },
      { memberId: members[4].id, priestId: padreId, type: 'CRISMA', date: DateTime.fromISO('2023-11-15') },
    ])

    // 6. CATEQUESE
    const turma = await CatechismClass.create({
      name: 'Eucaristia - Turma A',
      year: 2024,
      catechistId: coordenadoraId,
    })

    const alunos = [members[2], members[5]]
    for (const aluno of alunos) {
      await CatechismEnrollment.create({
        classId: turma.id,
        memberId: aluno.id,
      })
    }

    // Chamadas de teste
    for (let i = 0; i < 4; i++) {
      const date = DateTime.fromISO('2024-02-01').plus({ weeks: i })
      for (const aluno of alunos) {
        await Attendance.create({
          classId: turma.id,
          memberId: aluno.id,
          date: date,
          present: Math.random() > 0.2, // 80% de chance de presença
        })
      }
    }
  }
}