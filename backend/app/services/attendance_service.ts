import Attendance from '#models/attendance'
import { DateTime } from '../../node_modules/@types/luxon/index.js'

export default class AttendanceService {
    /**
     * Mark attendance for a catechism class
     */
    async markCatechismAttendance(data: { classId: number; memberId: number; date: string; present: boolean }) {
        return await Attendance.updateOrCreate(
            {
                classId: data.classId,
                memberId: data.memberId,
                date: DateTime.fromISO(data.date).toISODate() as any,
            },
            {
                present: data.present,
            }
        )
    }

    /**
     * Mark attendance for a pastoral event
     */
    async markPastoralAttendance(data: { pastoralEventId: number; memberId: number; date: string; present: boolean }) {
        return await Attendance.updateOrCreate(
            {
                pastoralEventId: data.pastoralEventId,
                memberId: data.memberId,
                date: DateTime.fromISO(data.date).toISODate() as any,
            },
            {
                present: data.present,
            }
        )
    }
}
