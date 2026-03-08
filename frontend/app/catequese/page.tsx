'use client';

import { useCatequeseDashboard } from '@/hooks/useCatequeseDashboard';
import { DashboardHeader } from '@/components/catequese/DashboardHeader';
import { MetricCard } from '@/components/catequese/MetricCard';
import { ClassCard } from '@/components/catequese/ClassCard';
import { CreateClassModal } from '@/components/catequese/modals/CreateClassModal';
import { EditClassModal } from '@/components/catequese/modals/EditClassModal';
import { EditStudentModal } from '@/components/catequese/modals/EditStudentModal';
import { PendingSacramentsModal } from '@/components/catequese/modals/PendingSacramentsModal';

export default function CatequeseDashboard() {
    const {
        metrics,
        loading,
        selectedYear,
        setSelectedYear,
        showModal,
        setShowModal,
        showPendingModal,
        setShowPendingModal,
        pendingStudents,
        loadingPending,
        editingStudent,
        setEditingStudent,
        editingClass,
        setEditingClass,
        currentPage,
        setCurrentPage,
        uniqueYears,
        paginatedClasses,
        totalPages,
        handleLogout,
        handleCreateClass,
        handleUpdateClass,
        handleUpdateStudent,
        fetchPendingSacraments
    } = useCatequeseDashboard();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 lg:p-12">
            <div className="max-w-6xl mx-auto">
                <DashboardHeader
                    selectedYear={selectedYear}
                    onYearChange={setSelectedYear}
                    uniqueYears={uniqueYears}
                    onFetchPending={fetchPendingSacraments}
                    loadingPending={loadingPending}
                    onNewClass={() => setShowModal(true)}
                    onLogout={handleLogout}
                />

                {metrics && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        <MetricCard label="Total de Catequizandos" value={metrics.totalStudents} />
                        <MetricCard label="Taxa de Conclusão" value={`${metrics.completionRate}%`} valueClassName="text-emerald-600" />
                        <MetricCard label="Turmas Ativas" value={metrics.activeClasses} />
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
                                    <ClassCard
                                        key={cls.id}
                                        cls={cls}
                                        onEdit={setEditingClass}
                                    />
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

            <CreateClassModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleCreateClass}
            />

            <EditClassModal
                key={editingClass?.id}
                cls={editingClass}
                onClose={() => setEditingClass(null)}
                onSubmit={handleUpdateClass}
            />

            <PendingSacramentsModal
                isOpen={showPendingModal}
                onClose={() => setShowPendingModal(false)}
                students={pendingStudents}
                onEditStudent={setEditingStudent}
            />

            <EditStudentModal
                student={editingStudent}
                onClose={() => setEditingStudent(null)}
                onSubmit={async (e) => {
                    e.preventDefault();
                    if (editingStudent) handleUpdateStudent(editingStudent);
                }}
                setStudent={setEditingStudent}
            />
        </div>
    );
}
