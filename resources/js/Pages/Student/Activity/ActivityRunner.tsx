import { ActivityProvider, useActivity, Question, ActivityResult, SaveAttemptFn } from '@/Context/ActivityContext';
import GameHeader from './components/GameHeader';
import ReviewPauseScreen from './components/ReviewPauseScreen';
import MultipleChoice from './minigames/MultipleChoice';

export type ActivityType = 'multiple_choice' | 'true_false' | 'matching' | 'fill_blank' | 'dictation';

export interface ActivityRunnerProps {
    activityId: number;
    activityType: ActivityType;
    questions: Question[];
    initialHealth?: number;
    onComplete: (result: ActivityResult) => void;
    onSaveAttempt?: SaveAttemptFn;
    onPlaySound?: (sound: 'correct' | 'incorrect') => void;
}

/**
 * Orquestador único de toda actividad (sección 6.4 del documento maestro).
 * No contiene lógica de juego en sí mismo: toda vive en ActivityContext.
 * Aquí solo se decide QUÉ pintar (cabecera + minijuego inyectado + pantalla
 * de repaso), nunca CÓMO se calculan vidas/combo/XP.
 */
export default function ActivityRunner({
    activityId,
    activityType,
    questions,
    initialHealth = 5,
    onComplete,
    onSaveAttempt,
    onPlaySound,
}: ActivityRunnerProps) {
    return (
        <ActivityProvider
            activityId={activityId}
            questions={questions}
            initialHealth={initialHealth}
            onComplete={onComplete}
            onSaveAttempt={onSaveAttempt}
            onPlaySound={onPlaySound}
        >
            <ActivityRunnerInner activityType={activityType} />
        </ActivityProvider>
    );
}

function ActivityRunnerInner({ activityType }: { activityType: ActivityType }) {
    const {
        currentQuestion,
        currentIndex,
        totalQuestions,
        health,
        maxHealth,
        combo,
        xpEarned,
        isFeedbackMode,
        feedbackData,
        isPaused,
        actions: { handleAnswer, nextQuestion, resumeAfterReview },
    } = useActivity();

    if (isPaused) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <ReviewPauseScreen xpEarned={xpEarned} onResume={resumeAfterReview} />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <GameHeader
                health={health}
                maxHealth={maxHealth}
                combo={combo}
                currentIndex={currentIndex}
                totalQuestions={totalQuestions}
            />
            {renderMinigame(activityType, currentQuestion, handleAnswer, isFeedbackMode, feedbackData, nextQuestion)}
        </div>
    );
}

function renderMinigame(
    activityType: ActivityType,
    question: Question,
    onAnswer: (correct: boolean) => void,
    isFeedbackMode: boolean,
    feedbackData: ReturnType<typeof useActivity>['feedbackData'],
    onNext: () => void,
) {
    const props = { question, onAnswer, isFeedbackMode, feedbackData, onNext };

    switch (activityType) {
        case 'multiple_choice':
        case 'true_false':
            // TrueFalse todavía no tiene minijuego propio; de momento se
            // apoya en MultipleChoice (las opciones "Verdadero"/"Falso" ya
            // llegan como `options` normales desde el backend).
            return <MultipleChoice {...props} />;
        // TODO: 'matching' → <MatchingPairs />, 'fill_blank' → <FillBlank />,
        // 'dictation' → <Dictation /> — pendientes de construir.
        default:
            return <MultipleChoice {...props} />;
    }
}
