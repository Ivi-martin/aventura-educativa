import HealthBar from './HealthBar';
import QuestionCounter from './QuestionCounter';
import ComboDisplay from './ComboDisplay';

interface GameHeaderProps {
    health: number;
    maxHealth: number;
    combo: number;
    currentIndex: number;
    totalQuestions: number;
}

export default function GameHeader({
    health,
    maxHealth,
    combo,
    currentIndex,
    totalQuestions,
}: GameHeaderProps) {
    return (
        <header className="flex items-center justify-between gap-4 bg-[#16213e] border border-slate-700 rounded-2xl px-4 py-3 mb-6">
            <HealthBar health={health} maxHealth={maxHealth} />
            <QuestionCounter currentIndex={currentIndex} totalQuestions={totalQuestions} />
            <ComboDisplay combo={combo} />
        </header>
    );
}
