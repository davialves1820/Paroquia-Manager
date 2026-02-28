import CatechismClass from '#models/catechism_class'
import CatechismEnrollment from '#models/catechism_enrollment'
import Attendance from '#models/attendance'
import { DateTime } from '../../node_modules/@types/luxon/index.js'
import { inject } from '@adonisjs/core'
import AttendanceService from './attendance_service.js'

@inject()
export default class CatechismService {
    constructor(protected attendanceService: AttendanceService) { }

    async createClass(data: any) {
        return await CatechismClass.create(data)
    }

    async enroll(data: { classId: number; memberId: number }) {
        return await CatechismEnrollment.create({
            classId: data.classId,
            memberId: data.memberId,
            enrolledAt: DateTime.now(),
        })
    }

    async markAttendance(data: { classId: number; memberId: number; date: string; present: boolean }) {
        return this.attendanceService.markCatechismAttendance(data)
    }

    async getClassDetails(classId: number) {
        return await CatechismClass.query()
            .where('id', classId)
            .preload('catechist')
            .preload('enrollments', (q) => q.preload('member'))
            .preload('attendances')
            .firstOrFail()
    }

    async calculateFrequency(classId: number, memberId: number) {
        const attendances = await Attendance.query()
            .where('classId', classId)
            .where('memberId', memberId)

        const totalDays = attendances.length
        if (totalDays === 0) return 0

        const presentDays = attendances.filter((a) => a.present).length
        return (presentDays / totalDays) * 100
    }
}
