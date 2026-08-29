import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { LayoutDashboard, User as UserIcon, LogOut, Menu, X, Sparkles } from 'lucide-react';

type Role = 'family' | 'teacher' | 'content_editor' | 'admin';

const ROLE_LABELS: Record<Role, string> = {
    family: 'Familia',
    teacher: 'Profesor/a',
    content_editor: 'Editor de Contenido',
    admin: 'Administrador',
};

interface NavItem {
    label: string;
    href?: string; // si no hay href, es un placeholder "próximamente"
    icon: ReactNode;
    isCurrent?: boolean;
}

/**
 * Página maestra del panel de adultos (familia/profesor/editor/admin):
 * cabecera + sidebar + footer genéricos. El lado del juego del alumno
 * (Login, AdventureMap, TopicView, ActivityRunner) NO usa esta plantilla a
 * propósito: es una experiencia inmersiva a pantalla completa, sin chrome
 * de panel de administración alrededor.
 *
 * Se mantiene el mismo nombre de export/archivo que el layout original de
 * Breeze para no romper los imports existentes (Dashboard.tsx, Profile/Edit.tsx).
 */
export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user as { name: string; email: string; role: Role };
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems: NavItem[] = [
        {
            label: 'Panel principal',
            href: route('dashboard'),
            icon: <LayoutDashboard className="w-5 h-5" />,
            isCurrent: route().current('dashboard'),
        },
        // Secciones futuras, todavía sin ruta: se muestran deshabilitadas para
        // no prometer nada que no funcione, en vez de omitirlas sin más.
        ...(user.role === 'content_editor' || user.role === 'admin'
            ? [{ label: 'Gestión de contenidos', icon: <Sparkles className="w-5 h-5" /> }]
            : []),
        ...(user.role === 'teacher'
            ? [{ label: 'Mis clases', icon: <Sparkles className="w-5 h-5" /> }]
            : []),
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Cabecera */}
            <header className="h-16 shrink-0 bg-[#0f3460] text-white flex items-center justify-between px-4 sm:px-6 z-20">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSidebarOpen((v) => !v)}
                        className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/10"
                        aria-label="Abrir menú"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                    <Link href={route('dashboard')} className="font-bold text-lg tracking-wide">
                        🎒 Aventura Educativa
                    </Link>
                </div>

                <div className="flex items-center gap-3 text-sm">
                    <div className="hidden sm:block text-right">
                        <div className="font-semibold leading-tight">{user.name}</div>
                        <div className="text-white/60 text-xs leading-tight">{ROLE_LABELS[user.role]}</div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#f5a623] text-[#0f3460] font-bold flex items-center justify-center">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                </div>
            </header>

            <div className="flex flex-1 min-h-0">
                {/* Sidebar */}
                <aside
                    className={`${
                        sidebarOpen ? 'block' : 'hidden'
                    } lg:block w-64 shrink-0 bg-white border-r border-slate-200 p-4 space-y-1`}
                >
                    {navItems.map((item) =>
                        item.href ? (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                                    item.isCurrent
                                        ? 'bg-[#0f3460]/10 text-[#0f3460]'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ) : (
                            <div
                                key={item.label}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 cursor-not-allowed"
                                title="Próximamente"
                            >
                                {item.icon}
                                {item.label}
                                <span className="ml-auto text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">
                                    pronto
                                </span>
                            </div>
                        ),
                    )}

                    <div className="pt-2 mt-2 border-t border-slate-200 space-y-1">
                        <Link
                            href={route('profile.edit')}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                                route().current('profile.edit')
                                    ? 'bg-[#0f3460]/10 text-[#0f3460]'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <UserIcon className="w-5 h-5" />
                            Mi perfil
                        </Link>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-[#e94560] hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Cerrar sesión
                        </Link>
                    </div>
                </aside>

                {/* Contenido de la página */}
                <div className="flex-1 min-w-0 flex flex-col">
                    {header && (
                        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
                            {header}
                        </div>
                    )}
                    <main className="flex-1">{children}</main>

                    {/* Footer */}
                    <footer className="px-4 sm:px-6 py-4 text-center text-xs text-slate-400 border-t border-slate-200">
                        Aplicaciones Ivi MOCA © {new Date().getFullYear()}
                    </footer>
                </div>
            </div>
        </div>
    );
}
