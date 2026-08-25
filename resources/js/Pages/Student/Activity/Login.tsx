import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';

interface Student {
    id: number;
    name: string;
    avatar_settings: any;
}

interface Props {
    students: Student[];
}

export default function Login({ students }: Props) {
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    
    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        student_id: '',
        pin: '',
    });

    // Cuando se seleccionan 4 dígitos, enviamos el formulario automáticamente
    useEffect(() => {
        if (data.pin.length === 4) {
            submit();
        }
    }, [data.pin]);

    const handleStudentSelect = (student: Student) => {
        setSelectedStudent(student);
        setData('student_id', student.id.toString());
        clearErrors();
    };

    const handleNumberClick = (num: number) => {
        if (data.pin.length < 4) {
            setData('pin', data.pin + num.toString());
            clearErrors();
        }
    };

    const handleDelete = () => {
        setData('pin', data.pin.slice(0, -1));
        clearErrors();
    };

    const handleBack = () => {
        setSelectedStudent(null);
        reset();
        clearErrors();
    };

    const submit = () => {
        post(route('student.login.post'), {
            onError: () => {
                setData('pin', ''); // Limpiamos el PIN si hay error para que vuelva a intentarlo
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#1a1a2e] text-white flex flex-col items-center justify-center p-4 font-sans">
            <Head title="Entrar a la Aventura" />

            <div className="max-w-2xl w-full bg-[#16213e] rounded-3xl shadow-2xl p-8 border border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
                        ¡Aventura Educativa! 🚀
                    </h1>
                    <p className="text-slate-400 text-lg">
                        {!selectedStudent ? '¿Quién eres?' : `Hola, ${selectedStudent.name}. Introduce tu PIN secreto.`}
                    </p>
                </div>

                {!selectedStudent ? (
                    /* PASO 1: Selección de Alumno */
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {students.map((student) => (
                            <button
                                key={student.id}
                                onClick={() => handleStudentSelect(student)}
                                className="flex flex-col items-center justify-center p-6 bg-slate-800 rounded-2xl hover:bg-slate-700 hover:scale-105 transition-all border-2 border-transparent hover:border-[#f5a623] cursor-pointer"
                            >
                                <div className="w-20 h-20 bg-slate-600 rounded-full mb-4 flex items-center justify-center text-3xl">
                                    👾
                                </div>
                                <span className="font-bold text-xl text-slate-200">{student.name}</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    /* PASO 2: Teclado numérico para el PIN */
                    <div className="max-w-xs mx-auto flex flex-col items-center">
                        {/* Indicadores de PIN */}
                        <div className="flex space-x-4 mb-8">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-5 h-5 rounded-full transition-colors ${
                                        i < data.pin.length ? 'bg-[#f5a623]' : 'bg-slate-600'
                                    }`}
                                />
                            ))}
                        </div>

                        {errors.pin && (
                            <div className="mb-6 p-3 bg-red-500/20 text-[#ff6b6b] rounded-xl text-center font-bold w-full animate-pulse">
                                {errors.pin}
                            </div>
                        )}

                        {/* Teclado */}
                        <div className="grid grid-cols-3 gap-4 w-full">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => handleNumberClick(num)}
                                    disabled={processing}
                                    className="h-16 text-2xl font-bold bg-[#0f3460] rounded-2xl hover:bg-blue-800 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {num}
                                </button>
                            ))}
                            <button
                                onClick={handleBack}
                                disabled={processing}
                                className="h-16 text-lg font-bold bg-slate-700 rounded-2xl hover:bg-slate-600 active:scale-95 transition-all text-slate-300"
                            >
                                Volver
                            </button>
                            <button
                                onClick={() => handleNumberClick(0)}
                                disabled={processing}
                                className="h-16 text-2xl font-bold bg-[#0f3460] rounded-2xl hover:bg-blue-800 active:scale-95 transition-all"
                            >
                                0
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={processing || data.pin.length === 0}
                                className="h-16 text-lg font-bold bg-[#e94560] rounded-2xl hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
                            >
                                ⌫
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}