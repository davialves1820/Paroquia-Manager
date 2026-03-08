import { Student } from '@/types';

interface StudentListItemProps {
    student: Student;
    isPresent: boolean;
    hasMeeting: boolean;
    onToggleAttendance: () => void;
    onRemove: () => void;
    onEdit: () => void;
    loadingAttendance?: boolean;
}

export const StudentListItem = ({
    student,
    isPresent,
    hasMeeting,
    onToggleAttendance,
    onRemove,
    onEdit,
    loadingAttendance
}: StudentListItemProps) => {
    return (
        <div className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
            <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span
                        className="font-medium text-zinc-900 dark:text-zinc-100 cursor-pointer hover:text-indigo-600 transition-colors truncate max-w-[200px] sm:max-w-none"
                        onClick={onEdit}
                    >
                        {student.name}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full shrink-0">
                        {student.frequency}% FREQ.
                    </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {student.hasBaptism ? (
                        <span className="text-[9px] bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Batizado</span>
                    ) : (
                        <span className="text-[9px] bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Falta Batismo</span>
                    )}
                    {student.hasFirstEucharist ? (
                        <span className="text-[9px] bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">1ª Eucaristia</span>
                    ) : (
                        <span className="text-[9px] bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Falta 1ª Euc.</span>
                    )}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${student.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' :
                        student.status === 'COMPLETED' ? 'bg-indigo-50 text-indigo-600' :
                            'bg-zinc-100 text-zinc-600'
                        }`}>
                        {student.status === 'ACTIVE' ? 'Ativo' : student.status === 'COMPLETED' ? 'Concluído' : 'Inativo'}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-center">
                <button
                    onClick={onRemove}
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                    title="Remover da Turma"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
                <button
                    onClick={onToggleAttendance}
                    disabled={!hasMeeting || loadingAttendance}
                    className={`min-w-[100px] px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${!hasMeeting
                        ? 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 cursor-not-allowed'
                        : isPresent
                            ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                            : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600'
                        } ${loadingAttendance ? 'opacity-50' : ''}`}
                >
                    {loadingAttendance && <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                    {isPresent ? 'Presente' : 'Ausente'}
                </button>
            </div>
        </div>
    );
};
