interface QuestionCounterProps {
    currentIndex: number;
    totalQuestions: number;
}

export default function QuestionCounter({ currentIndex, totalQuestions }: QuestionCounterProps) {
    const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

    return (
        <div className="flex flex-col items-center gap-1 min-w-[120px]">
            <span className="text-xs font-bold text-slate-300 tracking-wide">
                Pregunta {currentIndex + 1} de {totalQuestions}
            </span>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#f5a623] rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
