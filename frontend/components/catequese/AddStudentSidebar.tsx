import { useState, FormEvent } from 'react';

interface AddStudentSidebarProps {
    onSubmit: (name: string, hasBaptism: boolean, hasFirstEucharist: boolean) => Promise<void>;
    loading?: boolean;
}

export const AddStudentSidebar = ({ onSubmit, loading }: AddStudentSidebarProps) => {
    const [name, setName] = useState('');
    const [hasBaptism, setHasBaptism] = useState(false);
    const [hasFirstEucharist, setHasFirstEucharist] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await onSubmit(name, hasBaptism, hasFirstEucharist);
        setName('');
        setHasBaptism(false);
        setHasFirstEucharist(false);
    };

    return (
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-zinc-900 dark:text-white">Adicionar Catequizando</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nome Completo</label>
                    <input
                        type="text"
                        required
                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-white dark:bg-zinc-800"
                        placeholder="Nome do catequizando"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                    disabled={loading}
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {loading ? 'Cadastrando...' : 'Cadastrar Catequizando'}
                </button>
            </form>
        </div>
    );
};
