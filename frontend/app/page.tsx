import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-6">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Meninos de Jesus de Praga
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
          Sistema de Gestão de Pastorais e Catequese.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20"
          >
            Acessar Sistema
          </Link>
        </div>
      </div>
    </div>
  );
}
