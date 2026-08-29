import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Star, Lock } from 'lucide-react';

interface Topic {
    id: number;
    number: number;
    title: string;
    description: string | null;
    firstActivityId: number | null;
    stars: number;
    completed: boolean;
}

interface Props {
    subject: {
        id: number;
        name: string;
        color: string | null;
    };
    topics: Topic[];
}

export default function TopicView({ subject, topics }: Props) {
    return (
        <div className="min-h-screen bg-[#1a1a2e] text-white p-6 font-sans">
            <Head title={subject.name} />

            <header className="max-w-3xl mx-auto flex items-center gap-4 mb-8">
                <Link
                    href={route('student.adventure')}
                    className="w-10 h-10 flex items-center justify-center bg-[#16213e] rounded-full border border-slate-700 hover:bg-slate-700 transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-3xl font-bold" style={{ color: subject.color ?? '#3B82F6' }}>
                    {subject.name}
                </h1>
            </header>

            <main className="max-w-3xl mx-auto space-y-4">
                {topics.length === 0 && (
                    <p className="text-center text-slate-400">
                        Todavía no hay temas en esta asignatura.
                    </p>
                )}

                {topics.map((topic) => {
                    const isPlayable = topic.firstActivityId !== null;

                    const card = (
                        <div
                            className={`flex items-center gap-4 bg-[#16213e] p-5 rounded-2xl border border-slate-700 transition-all ${
                                isPlayable ? 'hover:border-[#f5a623] hover:scale-[1.02] cursor-pointer' : 'opacity-50'
                            }`}
                        >
                            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-lg text-slate-300 shrink-0">
                                {topic.number}
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-lg">{topic.title}</h3>
                                {topic.description && (
                                    <p className="text-sm text-slate-400">{topic.description}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                                {isPlayable ? (
                                    [1, 2, 3].map((i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${
                                                i <= topic.stars
                                                    ? 'fill-[#f5a623] text-[#f5a623]'
                                                    : 'text-slate-600'
                                            }`}
                                        />
                                    ))
                                ) : (
                                    <Lock className="w-5 h-5 text-slate-600" />
                                )}
                            </div>
                        </div>
                    );

                    return isPlayable ? (
                        <Link key={topic.id} href={route('student.activity.show', topic.firstActivityId!)}>
                            {card}
                        </Link>
                    ) : (
                        <div key={topic.id}>{card}</div>
                    );
                })}
            </main>
        </div>
    );
}
