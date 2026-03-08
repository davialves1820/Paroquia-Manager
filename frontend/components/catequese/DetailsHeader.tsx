import { useRouter } from 'next/navigation';

interface DetailsHeaderProps {
    name: string;
    year: number;
    onEdit: () => void;
}

export const DetailsHeader = ({ name, year, onEdit }: DetailsHeaderProps) => {
    const router = useRouter();

    return (
        <div className="mb-8">
            <button
                onClick={() => router.push('/catequese')}
                className="mb-8 flex items-center text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 transition-colors group"
            >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar para turmas
            </button>

            <div className="bg-white dark:bg-zinc-900 p-4 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">{name}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded uppercase tracking-wider">
                                Turma {year}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onEdit}
                        className="p-2.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all border border-zinc-200 dark:border-zinc-700"
                        title="Editar Turma"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
