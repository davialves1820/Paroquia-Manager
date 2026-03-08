interface MeetingToggleProps {
    hasMeeting: boolean;
    onToggle: () => void;
    loading: boolean;
}

export const MeetingToggle = ({ hasMeeting, onToggle, loading }: MeetingToggleProps) => {
    return (
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
                onClick={onToggle}
                disabled={loading}
                className={`px-6 py-2 rounded-lg font-bold transition-all shadow-sm flex items-center gap-2 ${hasMeeting
                    ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                    : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {hasMeeting ? 'Sim, teve encontro' : 'Não teve encontro'}
            </button>
        </div>
    );
};
