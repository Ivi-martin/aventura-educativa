import { Head, router } from '@inertiajs/react';

export default function AdventureMap() {
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
                        <h2 className="text-xl font-bold">¡Bienvenido, Explorador!</h2>
                        <p className="text-xs text-slate-400">Nivel 1 · 0 XP</p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#16213e] p-6 rounded-3xl border-2 border-[#3B82F6] hover:scale-105 transition-all cursor-pointer">
                        <div className="text-4xl mb-2">🔢</div>
                        <h3 className="text-2xl font-bold text-[#3B82F6]">Matemáticas</h3>
                        <p className="text-slate-400 text-sm mt-1">Mundo de los Números y Operaciones</p>
                    </div>

                    <div className="bg-[#16213e] p-6 rounded-3xl border-2 border-[#EF4444] hover:scale-105 transition-all cursor-pointer">
                        <div className="text-4xl mb-2">📚</div>
                        <h3 className="text-2xl font-bold text-[#EF4444]">Lengua</h3>
                        <p className="text-slate-400 text-sm mt-1">Mundo de las Palabras y Cuentos</p>
                    </div>

                    <div className="bg-[#16213e] p-6 rounded-3xl border-2 border-[#10B981] hover:scale-105 transition-all cursor-pointer">
                        <div className="text-4xl mb-2">🇬🇧</div>
                        <h3 className="text-2xl font-bold text-[#10B981]">Inglés</h3>
                        <p className="text-slate-400 text-sm mt-1">Mundo de los Idiomas</p>
                    </div>

                    <div className="bg-[#16213e] p-6 rounded-3xl border-2 border-[#F59E0B] hover:scale-105 transition-all cursor-pointer">
                        <div className="text-4xl mb-2">🌍</div>
                        <h3 className="text-2xl font-bold text-[#F59E0B]">Conocimiento del Medio</h3>
                        <p className="text-slate-400 text-sm mt-1">El Cuerpo Humano y la Naturaleza</p>
                    </div>
                </div>
            </main>
        </div>
    );
}