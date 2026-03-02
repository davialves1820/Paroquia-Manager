'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Catequizando {
    id: number;
    name: string;
    hasBaptism: boolean;
    hasFirstEucharist: boolean;
    frequency: number;
    status: string;
}

interface Attendance {
    id: number;
    catechismStudentId: number;
    date: string;
    present: boolean;
}

interface ClassDetails {
    id: number;
    name: string;
    year: number;
    students: Catequizando[];
    attendances: Attendance[];
}

export default function ClassDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [details, setDetails] = useState<ClassDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [studentName, setStudentName] = useState('');
    const [hasBaptism, setHasBaptism] = useState(false);
    const [hasFirstEucharist, setHasFirstEucharist] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [editingStudent, setEditingStudent] = useState<Catequizando | null>(null);
    const [hasMeeting, setHasMeeting] = useState(false);
    const [loadingMeeting, setLoadingMeeting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const router = useRouter();

    const fetchDetails = async () => {
        try {
            const response = await api.get(`/catechism/classes/${id}`);
            const sortedDetails = {
                ...response.data,
                students: [...response.data.students].sort((a, b) => a.name.localeCompare(b.name))
            };
            setDetails(sortedDetails);
        } catch (err) {
            console.error('Error fetching class details', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMeetingStatus = async () => {
        setLoadingMeeting(true);
        try {
            const response = await api.get('/catechism/meetings/status', {
                params: { classId: id, date: selectedDate }
            });
            setHasMeeting(response.data.occurred);
        } catch (err) {
            console.error('Error fetching meeting status', err);
        } finally {
            setLoadingMeeting(false);
        }
    };

    useEffect(() => {
        fetchDetails();
        fetchMeetingStatus();
        setCurrentPage(1); // Reset page on date change
    }, [id, selectedDate]);

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!details) return;

        const tempId = Math.random();
        const newStudent: Catequizando = {
            id: tempId,
            name: studentName,
            hasBaptism,
            hasFirstEucharist,
            frequency: 0,
            status: 'ACTIVE'
        };

        const previousStudents = [...details.students];
        const newStudents = [...previousStudents, newStudent].sort((a, b) => a.name.localeCompare(b.name));

        setDetails({ ...details, students: newStudents });

        // Clear form
        setStudentName('');
        setHasBaptism(false);
        setHasFirstEucharist(false);

        try {
            await api.post('/catechism/students', {
                classId: parseInt(id),
                name: newStudent.name,
                hasBaptism: newStudent.hasBaptism,
                hasFirstEucharist: newStudent.hasFirstEucharist,
            });
            fetchDetails(); // Sync with real ID and any server side logic
        } catch (err) {
            setDetails({ ...details, students: previousStudents });
            alert('Erro ao adicionar catequizando');
        }
    };

    const toggleAttendance = async (studentId: number, currentStatus: boolean | undefined) => {
        if (!details) return;

        const newStatus = !currentStatus;

        // Optimistic Update
        const previousAttendances = [...details.attendances];
        const newAttendances = [...previousAttendances];
        const index = newAttendances.findIndex(a => a.catechismStudentId === studentId && a.date.startsWith(selectedDate));

        if (index > -1) {
            newAttendances[index] = { ...newAttendances[index], present: newStatus };
        } else {
            newAttendances.push({
                id: Math.random(), // Temporary ID
                catechismStudentId: studentId,
                date: selectedDate,
                present: newStatus
            });
        }

        setDetails({ ...details, attendances: newAttendances });

        try {
            await api.post('/catechism/attendance', {
                classId: parseInt(id),
                studentId,
                date: selectedDate,
                present: newStatus,
            });
            // Re-fetch to get real IDs and updated frequencies
            fetchDetails();
        } catch (err) {
            // Revert on error
            setDetails({ ...details, attendances: previousAttendances });
            alert('Erro ao marcar presença');
        }
    };

    const handleRemoveStudent = async (studentId: number) => {
        if (!confirm('Deseja realmente remover este aluno?') || !details) return;

        const previousStudents = [...details.students];
        const newStudents = previousStudents.filter(s => s.id !== studentId);

        setDetails({ ...details, students: newStudents });

        try {
            await api.delete(`/catechism/students/${studentId}`);
            // No need to fetchDetails here if we're sure about the removal
        } catch (err) {
            setDetails({ ...details, students: previousStudents });
            alert('Erro ao remover aluno');
        }
    };

    const handleUpdateStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStudent || !details) return;

        const previousStudents = [...details.students];
        const newStudents = previousStudents.map(s =>
            s.id === editingStudent.id ? editingStudent : s
        ).sort((a, b) => a.name.localeCompare(b.name));

        setDetails({ ...details, students: newStudents });
        setEditingStudent(null);

        try {
            await api.put(`/catechism/students/${editingStudent.id}`, {
                name: editingStudent.name,
                hasBaptism: editingStudent.hasBaptism,
                hasFirstEucharist: editingStudent.hasFirstEucharist,
                status: editingStudent.status,
            });
            fetchDetails();
        } catch (err) {
            setDetails({ ...details, students: previousStudents });
            alert('Erro ao atualizar aluno');
        }
    };

    const handleToggleMeeting = async () => {
        if (!details) return;

        const previousHasMeeting = hasMeeting;
        const newValue = !hasMeeting;

        setHasMeeting(newValue);

        try {
            await api.post('/catechism/meetings', {
                classId: parseInt(id),
                date: selectedDate,
                occurred: newValue,
            });
            fetchDetails(); // Recalculate frequencies
        } catch (err) {
            setHasMeeting(previousHasMeeting);
            alert('Erro ao atualizar status do encontro');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (!details) return <div className="p-12 text-center text-zinc-900 dark:text-white">Turma não encontrada.</div>;

    const totalPages = Math.ceil(details.students.length / itemsPerPage);
    const paginatedStudents = details.students.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 lg:p-12">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="mb-8 flex items-center text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Voltar para turmas
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-zinc-900 p-4 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">{details.name}</h1>
                            <p className="text-zinc-500 mt-1">Ano: {details.year}</p>

                            <div className="mt-12">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Lista de Catequizandos</h2>
                                    <div className="flex items-center gap-3">
                                        <label className="text-sm font-medium text-zinc-500">Data:</label>
                                        <input
                                            type="date"
                                            className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1 text-sm dark:bg-zinc-800 dark:text-white"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl p-4 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${hasMeeting ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-zinc-900 dark:text-white">Houve encontro nesta data?</p>
                                            <p className="text-xs text-zinc-500">{hasMeeting ? 'A frequência será contabilizada.' : 'Este sábado não contará para a frequência.'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleToggleMeeting}
                                        disabled={loadingMeeting}
                                        className={`px-6 py-2 rounded-lg font-bold transition-all shadow-sm ${hasMeeting
                                            ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                                            : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600'
                                            }`}
                                    >
                                        {hasMeeting ? 'Sim, teve encontro' : 'Não teve encontro'}
                                    </button>
                                </div>

                                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {paginatedStudents.length > 0 ? (
                                        paginatedStudents.map((student) => {
                                            const attendance = details.attendances.find(
                                                (a) => a.catechismStudentId === student.id && a.date.startsWith(selectedDate)
                                            );
                                            const isPresent = attendance?.present || false;

                                            return (
                                                <div key={student.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
                                                    <div className="flex flex-col min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-medium text-zinc-900 dark:text-zinc-100 cursor-pointer hover:text-indigo-600 transition-colors truncate max-w-[200px] sm:max-w-none" onClick={() => setEditingStudent(student)}>
                                                                {student.name}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full shrink-0">
                                                                {student.frequency}% freq.
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            {student.hasBaptism ? (
                                                                <span className="text-[9px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Batizado</span>
                                                            ) : (
                                                                <span className="text-[9px] bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Falta Batismo</span>
                                                            )}
                                                            {student.hasFirstEucharist ? (
                                                                <span className="text-[9px] bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">1ª Eucaristia</span>
                                                            ) : (
                                                                <span className="text-[9px] bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Falta 1ª Euc.</span>
                                                            )}
                                                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${student.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                                                                student.status === 'COMPLETED' ? 'bg-indigo-100 text-indigo-700' :
                                                                    'bg-zinc-100 text-zinc-700'
                                                                }`}>
                                                                {student.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 self-end sm:self-center">
                                                        <button
                                                            onClick={() => handleRemoveStudent(student.id)}
                                                            className="p-2 text-zinc-400 hover:text-red-500 transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => toggleAttendance(student.id, isPresent)}
                                                            disabled={!hasMeeting}
                                                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${!hasMeeting
                                                                ? 'opacity-50 cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800'
                                                                : isPresent
                                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                                    : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                                                                }`}
                                                        >
                                                            {isPresent ? 'Presente' : 'Ausente'}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="py-8 text-center text-zinc-500">Nenhum catequizando cadastrado nesta turma.</p>
                                    )}
                                </div>

                                {totalPages > 1 && (
                                    <div className="mt-8 flex justify-center items-center gap-4">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <span className="text-xs font-medium text-zinc-500">
                                            {currentPage} / {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <h2 className="text-xl font-bold mb-6 text-zinc-900 dark:text-white">Adicionar Catequizando</h2>
                            <form onSubmit={handleAddStudent} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-white dark:bg-zinc-800"
                                        placeholder="Nome do catequizando"
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-3 pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                className="peer sr-only"
                                                checked={hasBaptism}
                                                onChange={(e) => setHasBaptism(e.target.checked)}
                                            />
                                            <div className="h-5 w-5 rounded border-2 border-zinc-300 dark:border-zinc-700 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center">
                                                <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Já possui Batismo</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                className="peer sr-only"
                                                checked={hasFirstEucharist}
                                                onChange={(e) => setHasFirstEucharist(e.target.checked)}
                                            />
                                            <div className="h-5 w-5 rounded border-2 border-zinc-300 dark:border-zinc-700 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center">
                                                <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Já possui 1ª Eucaristia</span>
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/10"
                                >
                                    Cadastrar Catequizando
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Catequizando Modal */}
            {editingStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">Editar Catequizando</h2>
                        <form onSubmit={handleUpdateStudent} className="space-y-6">
                            <p className="font-medium text-zinc-900 dark:text-white">{editingStudent.name}</p>

                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={editingStudent.hasBaptism}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, hasBaptism: e.target.checked })}
                                    />
                                    <span className="text-sm text-zinc-700 dark:text-zinc-300">Possui Batismo</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={editingStudent.hasFirstEucharist}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, hasFirstEucharist: e.target.checked })}
                                    />
                                    <span className="text-sm text-zinc-700 dark:text-zinc-300">Possui 1ª Eucaristia</span>
                                </label>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Status</label>
                                    <select
                                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                        value={editingStudent.status}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, status: e.target.value })}
                                    >
                                        <option value="ACTIVE">Ativo</option>
                                        <option value="COMPLETED">Concluído</option>
                                        <option value="DROPPED">Desistiu</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setEditingStudent(null)}
                                    className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 transition-colors"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
