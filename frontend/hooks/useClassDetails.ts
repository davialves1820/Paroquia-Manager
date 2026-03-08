import { useState, useCallback, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import { ClassDetails, Student, CatechismClass } from '@/types';

export const useClassDetails = (id: string) => {
    const [classData, setClassData] = useState<ClassDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [hasMeeting, setHasMeeting] = useState(false);
    const [loadingMeeting, setLoadingMeeting] = useState(false);
    const [loadingAttendance, setLoadingAttendance] = useState<Record<number, boolean>>({});
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [editingClass, setEditingClass] = useState<CatechismClass | null>(null);
    const [loadingAction, setLoadingAction] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchData = useCallback(async (silent = false) => {
        if (!silent) {
            setLoading(true);
        }
        try {
            const [classRes, meetingRes] = await Promise.all([
                api.get(`/catechism/classes/${id}`),
                api.get('/catechism/meetings/status', {
                    params: { classId: id, date: selectedDate }
                })
            ]);

            const mappedClassData = {
                ...classRes.data,
                students: [...(classRes.data.students || [])].sort((a, b) => a.name.localeCompare(b.name)),
                attendances: classRes.data.attendances?.map((a: { id: number; studentId?: number; catechismStudentId?: number; date: string; isPresent?: boolean; present?: boolean }) => ({
                    id: a.id,
                    studentId: a.studentId || a.catechismStudentId,
                    date: a.date,
                    isPresent: a.isPresent !== undefined ? a.isPresent : a.present
                }))
            };

            setClassData(mappedClassData);
            setHasMeeting(meetingRes.data.occurred);
        } catch (err) {
            console.error('Error fetching data', err);
        } finally {
            if (!silent) {
                setLoading(false);
            }
        }
    }, [id, selectedDate]);

    useEffect(() => {
        fetchData();
        setCurrentPage(1);
    }, [fetchData]);

    const handleToggleMeeting = async () => {
        const newValue = !hasMeeting;
        setLoadingMeeting(true);
        try {
            await api.post('/catechism/meetings', {
                classId: parseInt(id),
                date: selectedDate,
                occurred: newValue
            });
            await fetchData(true);
        } catch {
            alert('Erro ao alterar status do encontro');
        } finally {
            setLoadingMeeting(false);
        }
    };

    const handleToggleAttendance = async (studentId: number, isPresent: boolean) => {
        setLoadingAttendance(prev => ({ ...prev, [studentId]: true }));
        try {
            await api.post('/catechism/attendance', {
                classId: parseInt(id),
                studentId,
                date: selectedDate,
                present: isPresent
            });
            await fetchData(true);
        } catch {
            alert('Erro ao marcar presença');
        } finally {
            setLoadingAttendance(prev => ({ ...prev, [studentId]: false }));
        }
    };

    const handleAddStudent = async (name: string, baptism: boolean, firstEucharist: boolean) => {
        setLoadingAction(true);
        try {
            await api.post('/catechism/students', {
                classId: parseInt(id),
                name,
                hasBaptism: baptism,
                hasFirstEucharist: firstEucharist
            });
            await fetchData(true);
        } catch {
            alert('Erro ao cadastrar aluno');
        } finally {
            setLoadingAction(false);
        }
    };

    const handleUpdateStudent = async (student: Student) => {
        setLoadingAction(true);
        try {
            await api.put(`/catechism/students/${student.id}`, {
                name: student.name,
                hasBaptism: student.hasBaptism,
                hasFirstEucharist: student.hasFirstEucharist,
                status: student.status
            });
            setEditingStudent(null);
            await fetchData(true);
        } catch {
            alert('Erro ao atualizar aluno');
        } finally {
            setLoadingAction(false);
        }
    };

    const handleRemoveStudent = async (studentId: number) => {
        if (!confirm('Deseja realmente remover este aluno?')) {
            return;
        }
        setLoadingAction(true);
        try {
            await api.delete(`/catechism/students/${studentId}`);
            await fetchData(true);
        } catch {
            alert('Erro ao remover aluno');
        } finally {
            setLoadingAction(false);
        }
    };

    const handleUpdateClass = async (idNum: number, name: string, year: number) => {
        setLoadingAction(true);
        try {
            await api.put(`/catechism/classes/${idNum}`, {
                name,
                year,
                catechistId: classData?.catechistId || 1
            });
            setEditingClass(null);
            await fetchData(true);
        } catch {
            alert('Erro ao atualizar turma');
        } finally {
            setLoadingAction(false);
        }
    };

    const paginatedStudents = useMemo(() => {
        if (!classData) {
            return [];
        }

        return classData.students.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [classData, currentPage]);

    const totalPages = useMemo(() => {
        if (!classData) {
            return 0;
        }
        return Math.ceil(classData.students.length / itemsPerPage);
    }, [classData]);

    return {
        details: classData,
        loading,
        selectedDate,
        setSelectedDate,
        hasMeeting,
        loadingMeeting,
        loadingAttendance,
        editingStudent,
        setEditingStudent,
        editingClass,
        setEditingClass,
        currentPage,
        setCurrentPage,
        paginatedStudents,
        totalPages,
        loadingAction,
        handleToggleMeeting,
        handleToggleAttendance,
        handleAddStudent,
        handleRemoveStudent,
        handleUpdateStudent,
        handleUpdateClass
    };
};
