import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { FeedbackData } from '@/Context/ActivityContext';

interface ActivityFeedbackProps {
    feedbackData: FeedbackData;
    onNext: () => void;
}

export default function ActivityFeedback({ feedbackData, onNext }: ActivityFeedbackProps) {
    const { correct, explanation, xpGained } = feedbackData;

    useEffect(() => {
        if (correct) {
            confetti({
                particleCount: 60,
                spread: 70,
                origin: { y: 0.7 },
                colors: ['#f5a623', '#2ecc71', '#0f3460'],
            });
        }
    }, [correct]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={
                correct
                    ? { opacity: 1, y: 0 }
                    : { opacity: 1, y: 0, x: [0, -6, 6, -4, 4, 0] } // shake suave, no agresivo
            }
            transition={{ duration: correct ? 0.25 : 0.4 }}
            className={`mt-6 p-5 rounded-2xl border ${
                correct
                    ? 'bg-[#2ecc71]/10 border-[#2ecc71]/40'
                    : 'bg-[#ff6b6b]/10 border-[#ff6b6b]/40'
            }`}
        >
            <div className="flex items-center gap-3 mb-2">
                {correct ? (
                    <CheckCircle2 className="w-7 h-7 text-[#2ecc71]" />
                ) : (
                    <XCircle className="w-7 h-7 text-[#ff6b6b]" />
                )}
                <span className={`text-lg font-bold ${correct ? 'text-[#2ecc71]' : 'text-[#ff6b6b]'}`}>
                    {correct ? '¡Correcto!' : 'Casi... ¡vamos con la siguiente!'}
                </span>
                {correct && xpGained > 0 && (
                    <span className="ml-auto text-sm font-bold text-[#f5a623]">+{xpGained} XP</span>
                )}
            </div>

            {explanation && <p className="text-slate-300 text-sm mb-4">{explanation}</p>}

            <button
                onClick={onNext}
                className="w-full py-3 rounded-xl font-bold text-white bg-[#0f3460] hover:bg-blue-800 active:scale-95 transition-all"
            >
                Siguiente
            </button>
        </motion.div>
    );
}
