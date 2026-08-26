import { useState } from 'react';
import type { Question, FeedbackData } from '@/Context/ActivityContext';
import ActivityFeedback from '../components/ActivityFeedback';

interface MultipleChoiceProps {
    question: Question;
    onAnswer: (correct: boolean) => void;
    isFeedbackMode: boolean;
    feedbackData: FeedbackData | null;
    onNext: () => void;
}

/**
 * Minijuego "tonto": no sabe nada de vidas, combo ni XP. Solo pinta la
 * pregunta, deja elegir una opción y delega el resultado a `onAnswer`.
 * ActivityRunner/ActivityContext deciden qué pasa después.
 */
export default function MultipleChoice({
    question,
    onAnswer,
    isFeedbackMode,
    feedbackData,
    onNext,
}: MultipleChoiceProps) {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleSelect = (optionId: number) => {
        if (isFeedbackMode) return;
        setSelectedId(optionId);
        const isCorrect = question.options?.find((o) => o.id === optionId)?.is_correct ?? false;
        onAnswer(isCorrect);
    };

    return (
        <div className="bg-[#16213e] border border-slate-700 rounded-3xl p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
                {question.text}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(question.options ?? []).map((option) => {
                    const isSelected = selectedId === option.id;
                    const showAsCorrect = isFeedbackMode && option.is_correct;
                    const showAsWrongSelected = isFeedbackMode && isSelected && !option.is_correct;

                    return (
                        <button
                            key={option.id}
                            onClick={() => handleSelect(option.id)}
                            disabled={isFeedbackMode}
                            className={`p-4 rounded-2xl font-semibold text-left transition-all border-2 ${
                                showAsCorrect
                                    ? 'bg-[#2ecc71]/20 border-[#2ecc71] text-white'
                                    : showAsWrongSelected
                                      ? 'bg-[#ff6b6b]/20 border-[#ff6b6b] text-white'
                                      : isSelected
                                        ? 'bg-[#0f3460] border-[#0f3460] text-white'
                                        : 'bg-slate-800 border-transparent text-slate-200 hover:border-[#f5a623] hover:bg-slate-700'
                            } disabled:cursor-default`}
                        >
                            {option.text}
                        </button>
                    );
                })}
            </div>

            {isFeedbackMode && feedbackData && (
                <ActivityFeedback feedbackData={feedbackData} onNext={onNext} />
            )}
        </div>
    );
}
