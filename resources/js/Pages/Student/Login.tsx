import { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Eraser, Trash2, Check } from 'lucide-react';

interface Student {
    id: number;
    name: string;
    avatar_settings: any;
}

interface Props {
    students: Student[];
}

const NUMPAD_SUBLABELS: Record<number, string> = {
    1: 'QZ',
    2: 'ABC',
    3: 'DEF',
    4: 'GHI',
    5: 'JKL',
    6: 'MNO',
    7: 'PRS',
    8: 'TUV',
    9: 'WXY',
};

export default function Login({ students }: Props) {
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [message, setMessage] = useState('🔑 PIN de 4 dígitos');
    const [messageOk, setMessageOk] = useState(false);

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        student_id: '',
        pin: '',
    });

    const handleStudentSelect = (student: Student) => {
        setSelectedStudent(student);
        setData('student_id', student.id.toString());
        clearErrors();
        setMessage('🔑 PIN de 4 dígitos');
        setMessageOk(false);
    };

    const handleNumberClick = (num: number) => {
        if (processing) return;

        if (data.pin.length < 4) {
            const next = data.pin + num.toString();
            setData('pin', next);
            clearErrors();
            setMessageOk(false);
            setMessage(next.length === 4 ? '✅ ¡Listo! Pulsa Entrar' : '🔢 Sigue escribiendo tu PIN');
        } else {
            setMessage('⚠️ Ya tienes 4 dígitos, pulsa Entrar');
        }
    };

    const handleDelete = () => {
        if (processing) return;
        if (data.pin.length === 0) {
            setMessage('❌ No hay dígitos que borrar');
            return;
        }
        setData('pin', data.pin.slice(0, -1));
        clearErrors();
        setMessageOk(false);
        setMessage('⌫ Borraste un dígito');
    };

    const handleClearAll = () => {
        if (processing) return;
        setData('pin', '');
        clearErrors();
        setMessageOk(false);
        setMessage('🗑️ PIN borrado, empieza de nuevo');
    };

    const handleBack = () => {
        setSelectedStudent(null);
        reset();
        clearErrors();
    };

    const submit = () => {
        if (data.pin.length !== 4 || processing) return;

        post(route('student.login.post'), {
            onError: () => {
                setData('pin', ''); // Limpiamos el PIN si hay error para que vuelva a intentarlo
                setMessage('❌ PIN incorrecto. Inténtalo de nuevo');
                setMessageOk(false);
            },
        });
    };

    // Soporte de teclado físico (además del táctil), solo activo en el paso del PIN
    useEffect(() => {
        if (!selectedStudent) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key >= '0' && e.key <= '9') {
                handleNumberClick(Number(e.key));
                e.preventDefault();
            } else if (e.key === 'Backspace') {
                handleDelete();
                e.preventDefault();
            } else if (e.key === 'Delete' || e.key === 'Escape') {
                handleClearAll();
                e.preventDefault();
            } else if (e.key === 'Enter') {
                submit();
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedStudent, data.pin, processing]);

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
                    /* PASO 2: Teclado numérico para el PIN, estilo panel de cajero */
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                        <div className="w-full bg-gradient-to-b from-slate-700 to-slate-900 rounded-[2rem] p-5 border border-slate-600 shadow-2xl">
                            {/* Pantalla, enmarcada aparte como en un cajero de verdad */}
                            <div className="bg-[#0a0e1a] rounded-2xl p-4 mb-3 border-2 border-slate-800 shadow-inner">
                                <div className="flex justify-center space-x-3">
                                    {[0, 1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className={`w-12 h-14 rounded-xl flex items-center justify-center text-3xl font-bold border-2 transition-all ${
                                                i < data.pin.length
                                                    ? 'bg-[#0f3460] border-[#f5a623] text-white scale-105'
                                                    : 'bg-slate-900 border-slate-700 text-slate-700'
                                            }`}
                                        >
                                            {data.pin[i] ?? ''}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Mensaje de estado en vivo, como el prototipo de referencia */}
                            <p
                                className={`text-center text-sm font-semibold mb-4 min-h-[20px] transition-colors ${
                                    messageOk ? 'text-[#2ecc71]' : 'text-slate-400'
                                }`}
                            >
                                {message}
                            </p>

                            {errors.pin && (
                                <div className="mb-4 p-3 bg-red-500/20 text-[#ff6b6b] rounded-xl text-center font-bold w-full animate-pulse">
                                    {errors.pin}
                                </div>
                            )}

                            <div className="flex gap-3">
                                {/* Teclas numéricas con relieve, como botones físicos */}
                                <div className="grid grid-cols-3 gap-3 flex-1">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => handleNumberClick(num)}
                                            disabled={processing}
                                            className="h-16 rounded-xl font-bold bg-gradient-to-b from-slate-100 to-slate-300 text-slate-900 shadow-[0_4px_0_0_rgba(0,0,0,0.35)] active:shadow-none active:translate-y-1 hover:brightness-95 transition-all disabled:opacity-50 flex flex-col items-center justify-center leading-none"
                                        >
                                            <span className="text-2xl">{num}</span>
                                            <span className="text-[9px] font-semibold text-slate-500 tracking-wide mt-0.5">
                                                {NUMPAD_SUBLABELS[num]}
                                            </span>
                                        </button>
                                    ))}
                                    <div />
                                    <button
                                        onClick={() => handleNumberClick(0)}
                                        disabled={processing}
                                        className="h-16 rounded-xl text-2xl font-bold bg-gradient-to-b from-slate-100 to-slate-300 text-slate-900 shadow-[0_4px_0_0_rgba(0,0,0,0.35)] active:shadow-none active:translate-y-1 hover:brightness-95 transition-all disabled:opacity-50"
                                    >
                                        0
                                    </button>
                                    <div />
                                </div>

                                {/* Columna de acciones, 4 botones como el panel de referencia */}
                                <div className="flex flex-col gap-2 w-24">
                                    <button
                                        onClick={handleBack}
                                        disabled={processing}
                                        className="flex-1 rounded-xl bg-gradient-to-b from-slate-500 to-slate-700 text-white font-semibold text-[11px] flex flex-col items-center justify-center gap-1 shadow-[0_4px_0_0_rgba(0,0,0,0.35)] active:shadow-none active:translate-y-1 transition-all disabled:opacity-50"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Volver
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={processing || data.pin.length === 0}
                                        className="flex-1 rounded-xl bg-gradient-to-b from-[#f5a623] to-[#c77d0e] text-white font-semibold text-[11px] flex flex-col items-center justify-center gap-1 shadow-[0_4px_0_0_rgba(0,0,0,0.35)] active:shadow-none active:translate-y-1 transition-all disabled:opacity-40"
                                    >
                                        <Eraser className="w-4 h-4" />
                                        Borrar
                                    </button>
                                    <button
                                        onClick={handleClearAll}
                                        disabled={processing || data.pin.length === 0}
                                        className="flex-1 rounded-xl bg-gradient-to-b from-[#e94560] to-[#b8283f] text-white font-semibold text-[11px] flex flex-col items-center justify-center gap-1 shadow-[0_4px_0_0_rgba(0,0,0,0.35)] active:shadow-none active:translate-y-1 transition-all disabled:opacity-40"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Limpiar
                                    </button>
                                    <button
                                        onClick={submit}
                                        disabled={data.pin.length !== 4 || processing}
                                        className="flex-1 rounded-xl bg-gradient-to-b from-[#2ecc71] to-[#219150] text-white font-semibold text-[11px] flex flex-col items-center justify-center gap-1 shadow-[0_4px_0_0_rgba(0,0,0,0.35)] active:shadow-none active:translate-y-1 transition-all disabled:opacity-30 disabled:grayscale"
                                    >
                                        <Check className="w-4 h-4" />
                                        {processing ? '...' : 'Entrar'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
