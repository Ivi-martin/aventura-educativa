import { Head, Link, router } from '@inertiajs/react';

interface Subject {
    id: number;
    name: string;
    icon: string | null;
    color: string | null;
}

interface Props {
    student: {
        name: string;
        xpTotal: number;
        level: number;
    };
    subjects: Subject[];
}

export default function AdventureMap({ student, subjects }: Props) {
    const handleLogout = () => {
        router.post(route('student.logout'));
    };

    return (
        <div className="min-h-screen bg-[#1a1a2e] text-white p-6 font-sans">
            <Head title="Mapa de Aventura" />

            {/* Header del juego */}
            <header className="max-w-5xl mx-auto flex items-center justify-between bg-[#16213e] p-4 rounded-2xl border border-slate-700 mb-8">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#f5a623] rounded-full flex items-center justify-center text-2xl font-bold">
                        🤠
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">¡Bienvenido, {student.name}!</h2>
                        <p className="text-xs text-slate-400">
                            Nivel {student.level} · {student.xpTotal} XP
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-[#e94560] hover:bg-red-600 rounded-xl font-bold text-sm transition-all"
                >
                    Salir
                </button>
            </header>

            {/* Selector de Mundos / Asignaturas */}
            <main className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Elige tu Asignatura</h1>

                {subjects.length === 0 ? (
                    <p className="text-center text-slate-400">
                        Todavía no hay asignaturas con contenido. ¡Vuelve pronto!
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {subjects.map((subject) => (
                            <Link
                                key={subject.id}
                                href={route('student.topics', subject.id)}
                                className="block bg-[#16213e] p-6 rounded-3xl border-2 hover:scale-105 transition-all cursor-pointer"
                                style={{ borderColor: subject.color ?? '#3B82F6' }}
                            >
                                <div className="text-4xl mb-2">{subject.icon ?? '📘'}</div>
                                <h3 className="text-2xl font-bold" style={{ color: subject.color ?? '#3B82F6' }}>
                                    {subject.name}
                                </h3>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
