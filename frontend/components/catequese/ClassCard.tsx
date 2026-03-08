import Link from 'next/link';
import { CatechismClass } from '@/types';

interface ClassCardProps {
    cls: CatechismClass;
    onEdit: (cls: CatechismClass) => void;
}

export const ClassCard = ({ cls, onEdit }: ClassCardProps) => {
    return (
        <div className="group p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 relative">
            <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full uppercase tracking-wider">
                    {cls.year}
                </span>
                <button
                    onClick={() => onEdit(cls)}
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
    );
};
