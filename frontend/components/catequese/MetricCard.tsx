interface MetricCardProps {
    label: string;
    value: string | number;
    valueClassName?: string;
}

export const MetricCard = ({ label, value, valueClassName = "text-zinc-900 dark:text-white" }: MetricCardProps) => {
    return (
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
            <h3 className={`text-2xl font-bold mt-1 ${valueClassName}`}>{value}</h3>
        </div>
    );
};
