import { Head, router } from '@inertiajs/react';
import ActivityRunner, { ActivityType } from './ActivityRunner';
import type { Question, ActivityResult, SaveAttemptFn } from '@/Context/ActivityContext';

interface ShowProps {
    activityId: number;
    activityType: ActivityType;
    questions: Question[];
}

export default function Show({ activityId, activityType, questions }: ShowProps) {
    const handleComplete = (result: ActivityResult) => {
        router.post(route('student.activity.complete', { activity: activityId }), { ...result });
    };

    const handleSaveAttempt: SaveAttemptFn = ({ questionId, correct, xpGained, responseTimeMs }) => {
        router.post(
            route('student.activity.attempt', { activity: activityId }),
            { questionId, correct, xpGained, responseTimeMs },
            { preserveScroll: true, preserveState: true, only: [] },
        );
    };

    return (
        <div className="min-h-screen bg-[#1a1a2e] text-white">
            <Head title="Actividad" />
            <ActivityRunner
                activityId={activityId}
                activityType={activityType}
                questions={questions}
                onComplete={handleComplete}
                onSaveAttempt={handleSaveAttempt}
            />
        </div>
    );
}
