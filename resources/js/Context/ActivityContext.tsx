import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    ReactNode,
} from 'react';
import { calculateGems, calculateStars, calculateXPBonus } from '@/Lib/gamification';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface QuestionOption {
    id: number;
    text: string;
    is_correct: boolean;
    order: number;
}

/**
 * Forma genérica de una pregunta. `options` cubre multiple_choice/true_false;
 * `data_json` queda disponible para el resto de tipos (matching, fill_blank,
 * dictation), cada uno interpretará la parte que necesite.
 */
export interface Question {
    id: number;
    text: string;
    type: 'multiple_choice' | 'true_false' | 'matching' | 'fill_blank' | 'dictation';
    data_json?: Record<string, unknown> | null;
    xp_value: number;
    explanation: string | null;
    options?: QuestionOption[];
}

export interface FeedbackData {
    correct: boolean;
    explanation: string | null;
    xpGained: number;
}

export interface ActivityResult {
    stars: 1 | 2 | 3;
    xpEarned: number;
    gemsEarned: number;
    accuracy: number;
    attempts: number;
    combo: number;
}

/** Callback opcional para persistir cada intento; ActivityRunner lo conectará
 * al backend cuando exista la ruta (todavía no creada). Si no se pasa, el
 * intento simplemente no se persiste — el contexto sigue funcionando igual. */
export type SaveAttemptFn = (params: {
    questionId: number;
    correct: boolean;
    xpGained: number;
    responseTimeMs: number;
}) => void;

interface ActivityContextValue {
    // Estado
    currentQuestion: Question;
    currentIndex: number;
    totalQuestions: number;
    health: number;
    maxHealth: number;
    combo: number;
    totalCorrect: number;
    totalAttempts: number;
    xpEarned: number;
    isFeedbackMode: boolean;
    feedbackData: FeedbackData | null;
    isPaused: boolean; // "modo repaso" tras quedarse sin corazones
    isComplete: boolean;

    // Acciones
    actions: {
        handleAnswer: (correct: boolean) => void;
        nextQuestion: () => void;
        resumeAfterReview: () => void;
    };
}

const ActivityContext = createContext<ActivityContextValue | null>(null);

export function useActivity(): ActivityContextValue {
    const ctx = useContext(ActivityContext);
    if (!ctx) {
        throw new Error('useActivity debe usarse dentro de <ActivityProvider>');
    }
    return ctx;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface ActivityProviderProps {
    activityId: number;
    questions: Question[];
    initialHealth?: number;
    onComplete: (result: ActivityResult) => void;
    onSaveAttempt?: SaveAttemptFn;
    onPlaySound?: (sound: 'correct' | 'incorrect') => void;
    children: ReactNode;
}

export function ActivityProvider({
    activityId,
    questions,
    initialHealth = 5,
    onComplete,
    onSaveAttempt,
    onPlaySound,
    children,
}: ActivityProviderProps) {
    const maxHealth = initialHealth;

    // `queue` es la lista de preguntas que se están sirviendo AHORA MISMO.
    // Empieza siendo `questions` completo; si el alumno se queda sin
    // corazones, se sustituye por las preguntas falladas hasta el momento
    // (sección 8.2 / 6.4 corrección 2: nunca se reinicia el tema completo).
    const [queue, setQueue] = useState<Question[]>(questions);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [health, setHealth] = useState(maxHealth);
    const [combo, setCombo] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [xpEarned, setXpEarned] = useState(0);
    const [isFeedbackMode, setIsFeedbackMode] = useState(false);
    const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    // Preguntas falladas pendientes de repasar, sin duplicados, en orden de
    // primer fallo. Se van quitando de aquí cuando se responden bien.
    const failedQuestionsRef = useRef<Map<number, Question>>(new Map());

    // Cronómetro de la pregunta actual, para `response_time_ms`.
    const questionStartedAtRef = useRef<number>(Date.now());
    useEffect(() => {
        questionStartedAtRef.current = Date.now();
    }, [currentIndex, isPaused]);

    const currentQuestion = queue[currentIndex];

    const finishActivity = useCallback(() => {
        const stars = calculateStars(totalCorrect, questions.length);
        const gems = calculateGems(stars);
        setIsComplete(true);
        onComplete({
            stars,
            xpEarned,
            gemsEarned: gems,
            accuracy: totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0,
            attempts: totalAttempts,
            combo,
        });
    }, [totalCorrect, totalAttempts, xpEarned, combo, questions.length, onComplete]);

    const handleAnswer = useCallback(
        (correct: boolean) => {
            if (!currentQuestion || isFeedbackMode) return;

            // CORRECCIÓN 1 (evitar stale closure): calculamos el combo
            // actualizado ANTES de usarlo en cualquier otro cálculo de este
            // mismo acierto/fallo, nunca leyendo `combo` de un render previo.
            const updatedCombo = correct ? combo + 1 : 0;

            // Vidas: se pierde una al fallar; se recupera una cada 3 aciertos
            // SEGUIDOS, usando `updatedCombo` (el valor ya actualizado de
            // este acierto), nunca el `combo` del render anterior.
            const nextHealth = !correct
                ? Math.max(0, health - 1)
                : updatedCombo > 0 && updatedCombo % 3 === 0
                  ? Math.min(maxHealth, health + 1)
                  : health;

            const bonus = correct ? calculateXPBonus(updatedCombo) : 0;
            const xpGained = correct ? currentQuestion.xp_value + bonus : 0;
            const responseTimeMs = Date.now() - questionStartedAtRef.current;

            setCombo(updatedCombo);
            setHealth(nextHealth);
            setTotalCorrect((prev) => (correct ? prev + 1 : prev));
            setTotalAttempts((prev) => prev + 1);
            setXpEarned((prev) => prev + xpGained);
            setFeedbackData({ correct, explanation: currentQuestion.explanation, xpGained });
            setIsFeedbackMode(true);
            onPlaySound?.(correct ? 'correct' : 'incorrect');

            // Registro de preguntas falladas para el repaso no punitivo.
            if (!correct) {
                failedQuestionsRef.current.set(currentQuestion.id, currentQuestion);
            } else {
                failedQuestionsRef.current.delete(currentQuestion.id);
            }

            // El intento se guarda SIEMPRE, acierte o falle. El XP ya ganado
            // no se toca nunca a partir de aquí (sección 8.2).
            onSaveAttempt?.({
                questionId: currentQuestion.id,
                correct,
                xpGained,
                responseTimeMs,
            });

            if (nextHealth <= 0 && !correct) {
                // CORRECCIÓN 2: el sistema de vidas nunca es punitivo con el
                // progreso ya ganado. Solo pausamos; xpEarned y totalCorrect
                // acumulados hasta ahora se mantienen intactos.
                setIsPaused(true);
            }
        },
        [combo, health, maxHealth, currentQuestion, isFeedbackMode, onSaveAttempt, onPlaySound],
    );

    const resumeAfterReview = useCallback(() => {
        // Al reanudar, se restauran los corazones y se sustituye la cola
        // restante por SOLO las preguntas falladas hasta el momento — nunca
        // se reinicia el tema completo (sección 6.4, corrección 2).
        const pending = Array.from(failedQuestionsRef.current.values());

        setHealth(maxHealth);
        setIsPaused(false);
        setIsFeedbackMode(false);
        setFeedbackData(null);

        if (pending.length > 0) {
            setQueue(pending);
            setCurrentIndex(0);
        } else {
            // No debería ocurrir (si no hay falladas pendientes no habría
            // game over), pero por seguridad cerramos la actividad.
            finishActivity();
        }
    }, [maxHealth, finishActivity]);

    const nextQuestion = useCallback(() => {
        if (currentIndex < queue.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setIsFeedbackMode(false);
            setFeedbackData(null);
            return;
        }

        // Fin de la cola actual. Si quedan preguntas falladas pendientes
        // (por ejemplo, de una ronda de repaso donde alguna volvió a
        // fallar), empezamos otra ronda solo con esas.
        if (failedQuestionsRef.current.size > 0) {
            const pending = Array.from(failedQuestionsRef.current.values());
            setQueue(pending);
            setCurrentIndex(0);
            setIsFeedbackMode(false);
            setFeedbackData(null);
            return;
        }

        finishActivity();
    }, [currentIndex, queue.length, finishActivity]);

    const value = useMemo<ActivityContextValue>(
        () => ({
            currentQuestion,
            currentIndex,
            totalQuestions: questions.length,
            health,
            maxHealth,
            combo,
            totalCorrect,
            totalAttempts,
            xpEarned,
            isFeedbackMode,
            feedbackData,
            isPaused,
            isComplete,
            actions: { handleAnswer, nextQuestion, resumeAfterReview },
        }),
        [
            currentQuestion,
            currentIndex,
            questions.length,
            health,
            maxHealth,
            combo,
            totalCorrect,
            totalAttempts,
            xpEarned,
            isFeedbackMode,
            feedbackData,
            isPaused,
            isComplete,
            handleAnswer,
            nextQuestion,
            resumeAfterReview,
        ],
    );

    return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}
