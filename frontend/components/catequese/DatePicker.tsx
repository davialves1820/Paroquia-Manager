interface DatePickerProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
}

export const DatePicker = ({ selectedDate, onDateChange }: DatePickerProps) => {
    return (
        <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-zinc-500">Data:</label>
            <input
                type="date"
                className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1 text-sm dark:bg-zinc-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
            />
        </div>
    );
};
