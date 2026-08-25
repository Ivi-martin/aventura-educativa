import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface Student {
    id: number;
    name: string;
    pin: string; // <-- Añadido para poder leer el PIN plano desde la base de datos
    created_at: string;
}

interface Props {
    students: Student[];
}

interface FlashProps {
    success?: string;
    pin?: string;
}

// Componente auxiliar para cada fila de alumno para manejar su propio estado de mostrar/ocultar PIN
function StudentRow({ student }: { student: Student }) {
    const [showPin, setShowPin] = useState(false);

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span
                    onClick={() => setShowPin(!showPin)}
                    className="bg-gray-100 text-gray-700 font-mono px-3 py-1 rounded-full text-sm cursor-pointer select-none hover:bg-gray-200 transition"
                    title="Haz clic para mostrar u ocultar el PIN"
                >
                    {showPin ? student.pin : '••••'}
                </span>
            </td>
        </tr>
    );
}

export default function Dashboard({ students }: Props) {
    const { flash } = usePage().props as { flash?: FlashProps };
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('students.store'), {
            onSuccess: () => reset('name'),
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Panel del Profesor</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {flash?.success && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                            {flash.success}
                        </div>
                    )}
                    {/* Formulario para añadir alumno */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <section className="max-w-xl">
                            <header>
                                <h3 className="text-lg font-medium text-gray-900">Registrar Nuevo Alumno</h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    Introduce el nombre del alumno para generar su PIN de acceso.
                                </p>
                            </header>

                            <form onSubmit={submit} className="mt-6 space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Nombre del Alumno
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Ej. Lucas García"
                                        required
                                    />
                                    {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition"
                                >
                                    Guardar Alumno
                                </button>
                            </form>
                        </section>
                    </div>

                    {/* Tabla de alumnos */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Mis Alumnos</h3>
                        
                        {students.length === 0 ? (
                            <p className="text-gray-500 text-sm">Aún no has registrado a ningún alumno.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIN (Haz clic para ver)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {students.map((student) => (
                                            <StudentRow key={student.id} student={student} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}