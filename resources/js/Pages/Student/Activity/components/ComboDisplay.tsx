import { Flame } from 'lucide-react';

interface ComboDisplayProps {
    combo: number;
}

/**
 * Solo se resalta a partir de combo 3 (el primer umbral de recuperación de
 * vida/bonus de XP), para no distraer con un "combo 1" sin significado.
 */
export default function ComboDisplay({ combo }: ComboDisplayProps) {
    const isHot = combo >= 3;

    if (combo <= 0) {
        return <div className="w-16" />; // reserva espacio para no saltar el layout
    }

    return (
        <div
            className={`flex items-center gap-1 px-3 py-1 rounded-full font-bold text-sm transition-all ${
                isHot ? 'bg-[#f5a623]/20 text-[#f5a623]' : 'bg-slate-700 text-slate-300'
            }`}
        >
            <Flame className={`w-4 h-4 ${isHot ? 'fill-[#f5a623]' : ''}`} />
            {combo}
        </div>
    );
}
