'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

interface CatechismClass {
    id: number;
    name: string;
    year: number;
    catechistId: number;
}

interface Student {
    id: number;
    name: string;
    hasBaptism: boolean;
    hasFirstEucharist: boolean;
    status: string;
}

interface StudentMissingSacraments {
    id: number;
    name: string;
    hasBaptism: boolean;
    hasFirstEucharist: boolean;
    catechismClass: {
        name: string;
    };
}

export default function CatequeseDashboard() {
    const [classes, setClasses] = useState<CatechismClass[]>([]);
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState<string>('all');
    const [showModal, setShowModal] = useState(false);
    const [newClassName, setNewClassName] = useState('');
    const [newClassYear, setNewClassYear] = useState(new Date().getFullYear());
    const [showPendingModal, setShowPendingModal] = useState(false);
    const [pendingStudents, setPendingStudents] = useState<StudentMissingSacraments[]>([]);
    const [loadingPending, setLoadingPending] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [editingClass, setEditingClass] = useState<CatechismClass | null>(null);
    const [editClassName, setEditClassName] = useState('');
    const [editClassYear, setEditClassYear] = useState(new Date().getFullYear());
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchData = async () => {
        setLoading(true);
        try {
            const metricsParams = selectedYear !== 'all' ? { params: { year: parseInt(selectedYear) } } : {};
            const [classesRes, metricsRes] = await Promise.all([
                api.get('/catechism'),
                api.get('/catechism/metrics', metricsParams)
            ]);
            setClasses(classesRes.data || []);
            setMetrics(metricsRes.data);
            setCurrentPage(1); // Reset to first page on data fetch/filter
        } catch (err) {
            console.error('Error fetching data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedYear]);

    const handleUpdateStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStudent) return;
        try {
            await api.put(`/catechism/students/${editingStudent.id}`, {
                name: editingStudent.name,
                hasBaptism: editingStudent.hasBaptism,
                hasFirstEucharist: editingStudent.hasFirstEucharist,
                status: editingStudent.status,
            });
            setEditingStudent(null);
            if (showPendingModal) {
                // Refresh pending list if we were in the modal
                const response = await api.get('/catechism/missing-sacraments');
                setPendingStudents(response.data);
            }
            fetchData();
        } catch (err) {
            alert('Erro ao atualizar aluno');
        }
    };

    const handleCreateClass = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/catechism/classes', {
                name: newClassName,
                year: newClassYear,
                catechistId: 1, // Placeholder
            });
            setShowModal(false);
            setNewClassName('');
            fetchData();
        } catch (err) {
            alert('Erro ao criar turma');
        }
    };

    const handleUpdateClass = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingClass) return;
        try {
            await api.put(`/catechism/classes/${editingClass.id}`, {
                name: editClassName,
                year: editClassYear,
                catechistId: editingClass.catechistId,
            });
            setEditingClass(null);
            fetchData();
        } catch (err) {
            alert('Erro ao atualizar turma');
        }
    };

    const fetchPendingSacraments = async () => {
        setLoadingPending(true);
        try {
            const response = await api.get('/catechism/missing-sacraments');
            setPendingStudents(response.data);
            setShowPendingModal(true);
        } catch (err) {
            alert('Erro ao buscar pendências');
        } finally {
            setLoadingPending(false);
        }
    };

    const uniqueYears = Array.from(new Set(classes.map(c => c.year))).sort((a, b) => b - a);
    const filteredClasses = selectedYear === 'all'
        ? classes
        : classes.filter(c => c.year === parseInt(selectedYear));

    const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
    const paginatedClasses = filteredClasses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 lg:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                            Catequese
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                            Gerencie suas turmas e presenças de forma simples.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                        >
                            <option value="all">Todos os anos</option>
                            {uniqueYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <button
                            onClick={fetchPendingSacraments}
                            className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            Relatório de Pendências
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                        >
                            Nova Turma
                        </button>
                    </div>
                </div>

                {metrics && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total de Catequizandos</p>
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{metrics.totalStudents}</h3>
                        </div>
                        <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Taxa de Conclusão</p>
                            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{metrics.completionRate}%</h3>
                        </div>
                        <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Turmas Ativas</p>
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{metrics.activeClasses}</h3>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedClasses.length > 0 ? (
                                paginatedClasses.map((cls) => (
                                    <div
                                        key={cls.id}
                                        className="group p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 relative"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full uppercase tracking-wider">
                                                {cls.year}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    setEditingClass(cls);
                                                    setEditClassName(cls.name);
                                                    setEditClassYear(cls.year);
                                                }}
                                                className="p-2 text-zinc-400 hover:text-indigo-600 transition-colors"
                                                title="Editar Turma"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                        </div>
                                        <Link href={`/catequese/${cls.id}`}>
                                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                                {cls.name}
                                            </h3>
                                            <div className="mt-6 flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                                                <span>Ver detalhes</span>
                                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
                                    <p className="text-zinc-500">Nenhuma turma encontrada. Crie a primeira!</p>
                                </div>
                            )}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center items-center gap-4">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <span className="text-sm font-medium text-zinc-500">
                                    Página {currentPage} de {totalPages}
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
                    </>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">Criar Nova Turma</h2>
                        <form onSubmit={handleCreateClass} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nome da Turma</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-white dark:bg-zinc-800"
                                    value={newClassName}
                                    onChange={(e) => setNewClassName(e.target.value)}
                                    placeholder="Ex: São Thomás de Aquino"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Ano</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-white dark:bg-zinc-800"
                                    value={newClassYear}
                                    onChange={(e) => setNewClassYear(parseInt(e.target.value))}
                                />
                            </div>
                            <div className="flex gap-4 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 transition-colors"
                                >
                                    Criar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showPendingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl p-8 shadow-2xl max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white text-center">Catequizandos com Pendências Sacramentais</h2>
                            <button onClick={() => setShowPendingModal(false)} className="text-zinc-500 hover:text-zinc-700">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 pr-2">
                            {pendingStudents.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead className="sticky top-0 bg-white dark:bg-zinc-900 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                                        <tr>
                                            <th className="py-3 px-4">Nome</th>
                                            <th className="py-3 px-4">Turma</th>
                                            <th className="py-3 px-4">Pendência</th>
                                            <th className="py-3 px-4 text-right">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                        {pendingStudents.map((student) => (
                                            <tr key={student.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                                <td className="py-4 px-4 font-medium text-zinc-900 dark:text-zinc-200">{student.name}</td>
                                                <td className="py-4 px-4 text-zinc-500 dark:text-zinc-400">{student.catechismClass.name}</td>
                                                <td className="py-4 px-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {!student.hasBaptism && (
                                                            <span className="text-[10px] bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Batismo</span>
                                                        )}
                                                        {!student.hasFirstEucharist && (
                                                            <span className="text-[10px] bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">1ª Eucaristia</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <button
                                                        onClick={() => setEditingStudent({
                                                            id: student.id,
                                                            name: student.name,
                                                            hasBaptism: student.hasBaptism,
                                                            hasFirstEucharist: student.hasFirstEucharist,
                                                            status: 'ACTIVE' // Default as we don't have it in the pending API yet, but it allows editing
                                                        })}
                                                        className="text-indigo-600 hover:text-indigo-500 font-bold text-xs uppercase"
                                                    >
                                                        Editar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center py-12 text-zinc-500">Nenhum catequizando com pendência encontrada.</p>
                            )}
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={() => setShowPendingModal(false)}
                                className="w-full py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-700 dark:text-zinc-300 font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Student Modal Reused */}
            {editingStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800">
                        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">Editar Catequizando</h2>
                        <form onSubmit={handleUpdateStudent} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nome Completo</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-white dark:bg-zinc-800"
                                    value={editingStudent.name}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                                />
                            </div>

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

            {editingClass && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800">
                        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">Editar Turma</h2>
                        <form onSubmit={handleUpdateClass} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nome da Turma</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-white dark:bg-zinc-800"
                                    value={editClassName}
                                    onChange={(e) => setEditClassName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Ano</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-white dark:bg-zinc-800"
                                    value={editClassYear}
                                    onChange={(e) => setEditClassYear(parseInt(e.target.value))}
                                />
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setEditingClass(null)}
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
