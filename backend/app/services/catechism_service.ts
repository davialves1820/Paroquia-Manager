import CatechismStudent from '#models/catechism_student'
import Attendance from '#models/attendance'
import CatechismClass from '#models/catechism_class'
import CatechismMeeting from '#models/catechism_meeting'
import { inject } from '@adonisjs/core'
import AttendanceService from './attendance_service.js'
import { DateTime } from 'luxon'

@inject()
export default class CatechismService {
    constructor(protected attendanceService: AttendanceService) { }

    async listClasses() {
        return await CatechismClass.query().preload('catechist').preload('students').preload('attendances')
    }

    async createClass(data: any) {
        return await CatechismClass.create(data)
    }

    async addStudent(data: { classId: number; name: string; hasBaptism?: boolean; hasFirstEucharist?: boolean }) {
        return await CatechismStudent.create({
            classId: data.classId,
            name: data.name,
            hasBaptism: data.hasBaptism || false,
            hasFirstEucharist: data.hasFirstEucharist || false,
        })
    }

    async updateStudent(studentId: number, data: { name?: string; hasBaptism?: boolean; hasFirstEucharist?: boolean; status?: string }) {
        const student = await CatechismStudent.findOrFail(studentId)
        student.merge(data as any)
        await student.save()
        return student
    }

    async removeStudent(studentId: number) {
        const student = await CatechismStudent.findOrFail(studentId)
        await student.delete()
        return student
    }

    async markAttendance(data: { classId: number; studentId: number; date: string; present: boolean }) {
        return this.attendanceService.markCatechismAttendance(data)
    }

    async toggleMeeting(classId: number, date: string, occurred: boolean) {
        const meetingDate = DateTime.fromISO(date).toISODate()
        if (!meetingDate) throw new Error('Data inválida')

        const existing = await CatechismMeeting.query()
            .where('classId', classId)
            .where('date', meetingDate)
            .first()

        if (occurred && !existing) {
            await CatechismMeeting.create({ classId, date: DateTime.fromISO(meetingDate) })
        } else if (!occurred && existing) {
            await existing.delete()
        }
        return { occurred }
    }

    async getMeetingStatus(classId: number, date: string) {
        const meetingDate = DateTime.fromISO(date).toISODate()
        if (!meetingDate) return { occurred: false }

        const existing = await CatechismMeeting.query()
            .where('classId', classId)
            .where('date', meetingDate)
            .first()

        return { occurred: !!existing }
    }

    async getClassDetails(classId: number) {
        const catechismClass = await CatechismClass.query()
            .where('id', classId)
            .preload('catechist')
            .preload('students')
            .preload('attendances')
            .firstOrFail()

        // Calculate frequency for each student
        const studentsWithFrequency = await Promise.all(catechismClass.students.map(async (student) => {
            const frequency = await this.calculateFrequency(classId, student.id)
            return {
                ...student.toJSON(),
                frequency: parseFloat(frequency.toFixed(2))
            }
        }))

        return {
            ...catechismClass.toJSON(),
            students: studentsWithFrequency
        }
    }

    async calculateFrequency(classId: number, studentId: number) {
        const meetings = await CatechismMeeting.query()
            .where('classId', classId)

        const totalMeetings = meetings.length
        if (totalMeetings === 0) return 0

        const presentAttendances = await Attendance.query()
            .where('classId', classId)
            .where('catechismStudentId', studentId)
            .where('present', true)
            .whereIn('date', meetings.map(m => m.date.toISODate()!))
            .count('* as total')

        const presentCount = Number(presentAttendances[0].$extras.total || 0)
        return (presentCount / totalMeetings) * 100
    }

    async getMetrics(year?: number) {
        // Alunos por ano (sempre mostra todos os anos para o gráfico/lista, ou filtramos?)
        // O usuário pediu "as metricas exibidas seja só para aquele ano selecionado"
        // Então os totais devem ser filtrados.

        let studentsByYearQuery = CatechismClass.query()
            .select('year')
            .count('* as total')
            .innerJoin('catechism_students', 'catechism_classes.id', 'catechism_students.class_id')
            .groupBy('year')

        if (year) {
            studentsByYearQuery = studentsByYearQuery.where('year', year)
        }
        const studentsByYear = await studentsByYearQuery

        // Porcentagem de quem termina (COMPLETED / TOTAL)
        let totalStudentsQuery = CatechismStudent.query()
        let completedStudentsQuery = CatechismStudent.query().where('status', 'COMPLETED')

        if (year) {
            totalStudentsQuery = totalStudentsQuery.innerJoin('catechism_classes', 'catechism_classes.id', 'catechism_students.class_id').where('catechism_classes.year', year)
            completedStudentsQuery = completedStudentsQuery.innerJoin('catechism_classes', 'catechism_classes.id', 'catechism_students.class_id').where('catechism_classes.year', year)
        }

        const totalStudents = await totalStudentsQuery.count('* as total')
        const completedStudents = await completedStudentsQuery.count('* as total')

        const totalCount = Number(totalStudents[0].$extras.total || 0)
        const completedCount = Number(completedStudents[0].$extras.total || 0)
        const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

        // Turmas Ativas
        let activeClassesQuery = CatechismClass.query()
        if (year) {
            activeClassesQuery = activeClassesQuery.where('year', year)
        }
        const activeClassesCount = await activeClassesQuery.count('* as total')

        return {
            studentsByYear: studentsByYear.map(s => ({ year: s.year, total: Number(s.$extras.total) })),
            completionRate: parseFloat(completionRate.toFixed(2)),
            totalStudents: totalCount,
            activeClasses: Number(activeClassesCount[0].$extras.total || 0)
        }
    }

    async getStudentsMissingSacraments() {
        return await CatechismStudent.query()
            .where('hasBaptism', false)
            .orWhere('hasFirstEucharist', false)
            .preload('catechismClass')
    }
}
