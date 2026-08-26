import { Heart } from 'lucide-react';

interface HealthBarProps {
    health: number;
    maxHealth: number;
}

/**
 * Barra de vida (corazones). Puramente visual — ActivityRunner es quien
 * decide cuándo sube o baja `health`; este componente solo lo representa.
 */
export default function HealthBar({ health, maxHealth }: HealthBarProps) {
    return (
        <div className="flex items-center gap-1" aria-label={`${health} de ${maxHealth} corazones`}>
            {Array.from({ length: maxHealth }).map((_, i) => (
                <Heart
                    key={i}
                    className={`w-6 h-6 transition-all ${
                        i < health
                            ? 'fill-[#e94560] text-[#e94560] scale-100'
                            : 'fill-transparent text-slate-600 scale-90'
                    }`}
                />
            ))}
        </div>
    );
}
