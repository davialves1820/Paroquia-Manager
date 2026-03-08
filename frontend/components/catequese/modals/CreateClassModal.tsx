import { useState, FormEvent } from 'react';

interface CreateClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, year: number) => Promise<void>;
}

export const CreateClassModal = ({ isOpen, onClose, onSubmit }: CreateClassModalProps) => {
    const [name, setName] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await onSubmit(name, year);
        setName('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md p-8 shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">Criar Nova Turma</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nome da Turma</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-white dark:bg-zinc-800"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: São Thomás de Aquino"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Ano</label>
                        <input
                            type="number"
                            required
                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-white dark:bg-zinc-800"
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                        />
                    </div>
                    <div className="flex gap-4 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
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
    );
};
