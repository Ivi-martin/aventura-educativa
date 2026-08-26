import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface ReviewPauseScreenProps {
    xpEarned: number;
    onResume: () => void;
}

/**
 * Se muestra cuando `health` llega a 0. El tono es siempre amable: no es un
 * "game over", es una pausa para repasar. El XP ya ganado se mantiene visible
 * para que el niño vea que nada de lo conseguido se ha perdido.
 */
export default function ReviewPauseScreen({ xpEarned, onResume }: ReviewPauseScreenProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-md mx-auto text-center bg-[#16213e] border border-slate-700 rounded-3xl p-8"
        >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#f5a623]/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[#f5a623]" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">¡Vamos a repasar esto un momento!</h2>
            <p className="text-slate-400 mb-1">
                Todo lo que ya has conseguido se queda como está.
            </p>
            {xpEarned > 0 && (
                <p className="text-[#f5a623] font-bold mb-6">Ya llevas {xpEarned} XP ganados 🌟</p>
            )}

            <p className="text-slate-300 text-sm mb-6">
                Solo vamos a repetir las preguntas que te han costado un poco más. ¡Tú puedes!
            </p>

            <button
                onClick={onResume}
                className="w-full py-3 rounded-xl font-bold text-white bg-[#e94560] hover:bg-red-600 active:scale-95 transition-all"
            >
                Vamos allá
            </button>
        </motion.div>
    );
}
