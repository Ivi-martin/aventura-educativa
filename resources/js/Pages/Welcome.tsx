import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fff8ea] via-[#eaf6f3] to-[#dff0ef]">
            <Head title="Bienvenido" />

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
                <img
                    src="/images/logo-aventura.png"
                    alt="Aventura Educativa"
                    className="w-56 sm:w-72 mb-4 drop-shadow-xl select-none"
                    draggable={false}
                />

                <p className="text-slate-600 text-lg mb-10 max-w-md">
                    Aprender nunca fue tan divertido. Elige cómo quieres entrar:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-3xl">
                    <Link
                        href={route('login')}
                        className="flex flex-col items-center gap-3 bg-white rounded-3xl p-8 shadow-lg border-2 border-transparent hover:border-[#0f3460] hover:scale-105 transition-all"
                    >
                        <span className="text-5xl">⚙️</span>
                        <span className="font-bold text-lg text-[#0f3460]">Administrador</span>
                    </Link>

                    <Link
                        href={route('login')}
                        className="flex flex-col items-center gap-3 bg-white rounded-3xl p-8 shadow-lg border-2 border-transparent hover:border-[#f5a623] hover:scale-105 transition-all"
                    >
                        <span className="text-5xl">👨‍👩‍👦</span>
                        <span className="font-bold text-lg text-[#c77d0e]">Familia</span>
                    </Link>

                    <Link
                        href={route('student.login')}
                        className="flex flex-col items-center gap-3 bg-white rounded-3xl p-8 shadow-lg border-2 border-transparent hover:border-[#2ecc71] hover:scale-105 transition-all"
                    >
                        <span className="text-5xl">🎒</span>
                        <span className="font-bold text-lg text-[#219150]">Alumno</span>
                    </Link>
                </div>
            </main>

            {/* Pie oscuro a propósito: el logo de abajo es blanco y no se vería sobre fondo claro */}
            <footer className="bg-[#0a0e1a] py-6 flex flex-col items-center">
                <span className="text-slate-400 text-xs tracking-wide">Desarrollado por</span>
                <img
                    src="/images/logo-ivimoca.png"
                    alt="Ivi Moca"
                    className="h-12 select-none"
                    draggable={false}
                />
            </footer>
        </div>
    );
}
