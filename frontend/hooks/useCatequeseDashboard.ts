import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { CatechismClass, Student, StudentMissingSacraments, CatechismMetrics } from '@/types';

export const useCatequeseDashboard = () => {
    const [classes, setClasses] = useState<CatechismClass[]>([]);
    const [metrics, setMetrics] = useState<CatechismMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const router = useRouter();

    // Modal States
    const [showModal, setShowModal] = useState(false);
    const [showPendingModal, setShowPendingModal] = useState(false);
    const [editingClass, setEditingClass] = useState<CatechismClass | null>(null);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    // Form States
    const [newClassName, setNewClassName] = useState('');
    const [newClassYear, setNewClassYear] = useState(new Date().getFullYear());
    const [editClassName, setEditClassName] = useState('');
    const [editClassYear, setEditClassYear] = useState(new Date().getFullYear());

    // Data States
    const [pendingStudents, setPendingStudents] = useState<StudentMissingSacraments[]>([]);
    const [loadingPending, setLoadingPending] = useState(false);

    const fetchData = useCallback(async (silent = false) => {
        if (!silent) {
            setLoading(true);
        }

        try {
            const metricsParams = selectedYear !== 'all' ? { params: { year: parseInt(selectedYear) } } : {};
            const [classesRes, metricsRes] = await Promise.all([
                api.get('/catechism'),
                api.get('/catechism/metrics', metricsParams)
            ]);
            setClasses(classesRes.data || []);
            setMetrics(metricsRes.data);
            setCurrentPage(1);
        } catch (err) {
            console.error('Error fetching data', err);
        } finally {
            if (!silent) {
                setLoading(false);
            }
        }
    }, [selectedYear]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error('Erro ao fazer logout no servidor', err);
        } finally {
            localStorage.removeItem('token');
            router.push('/login');
        }
    };

    const handleCreateClass = async (name: string, year: number) => {
        try {
            await api.post('/catechism/classes', {
                name,
                year,
                catechistId: 1
            });
            setShowModal(false);
            fetchData(true);
        } catch {
            alert('Erro ao criar turma');
        }
    };

    const handleUpdateClass = async (id: number, name: string, year: number) => {
        try {
            await api.put(`/catechism/classes/${id}`, {
                name,
                year,
                catechistId: editingClass?.catechistId || 1
            });
            setEditingClass(null);
            fetchData(true);
        } catch {
            alert('Erro ao atualizar turma');
        }
    };

    const handleUpdateStudent = async (student: Student) => {
        try {
            await api.put(`/catechism/students/${student.id}`, {
                name: student.name,
                hasBaptism: student.hasBaptism,
                hasFirstEucharist: student.hasFirstEucharist,
                status: student.status,
            });
            setEditingStudent(null);
            if (showPendingModal) {
                fetchPendingSacraments();
            }
            fetchData(true);
        } catch {
            alert('Erro ao atualizar aluno');
        }
    };

    const fetchPendingSacraments = async () => {
        setLoadingPending(true);
        try {
            const response = await api.get('/catechism/missing-sacraments');
            setPendingStudents(response.data);
            setShowPendingModal(true);
        } catch {
            alert('Erro ao buscar pendências');
        } finally {
            setLoadingPending(false);
        }
    };

    // Update edit form when editingClass changes
    useEffect(() => {
        if (editingClass) {
            setEditClassName(editingClass.name);
            setEditClassYear(editingClass.year);
        }
    }, [editingClass]);

    const uniqueYears = useMemo(() =>
        Array.from(new Set(classes.map(c => c.year))).sort((a, b) => b - a),
        [classes]);

    const filteredClasses = useMemo(() =>
        selectedYear === 'all'
            ? classes
            : classes.filter(c => c.year === parseInt(selectedYear)),
        [classes, selectedYear]);

    const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
    const paginatedClasses = useMemo(() =>
        filteredClasses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
        [filteredClasses, currentPage, itemsPerPage]);

    return {
        classes,
        metrics,
        loading,
        selectedYear,
        setSelectedYear,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        showModal,
        setShowModal,
        showPendingModal,
        setShowPendingModal,
        editingClass,
        setEditingClass,
        editingStudent,
        setEditingStudent,
        newClassName,
        setNewClassName,
        newClassYear,
        setNewClassYear,
        editClassName,
        setEditClassName,
        editClassYear,
        setEditClassYear,
        pendingStudents,
        loadingPending,
        uniqueYears,
        paginatedClasses,
        totalPages,
        handleLogout,
        handleCreateClass,
        handleUpdateClass,
        handleUpdateStudent,
        fetchPendingSacraments,
        fetchData
    };
};
