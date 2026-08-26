/**
 * Funciones puras de cálculo de gamificación.
 *
 * Se mantienen separadas de ActivityContext para poder testearlas de forma
 * aislada con Vitest (Fase 6) sin necesidad de montar el contexto de React.
 *
 * Estos valores son de balanceo del juego y están pensados para ajustarse
 * con el tiempo (ver sección 12 del documento maestro: "Balanceo del juego"
 * debe quedar aislado y configurable, no disperso en el código).
 */

/** Bonus de XP por combo. Combos de 3 dan un pequeño extra, de 5 uno mayor. */
export function calculateXPBonus(combo: number): number {
    if (combo > 0 && combo % 5 === 0) return 15;
    if (combo > 0 && combo % 3 === 0) return 5;
    return 0;
}

/** Estrellas (1-3) según el % de aciertos sobre el total de preguntas del tema. */
export function calculateStars(totalCorrect: number, totalQuestions: number): 1 | 2 | 3 {
    if (totalQuestions <= 0) return 1;
    const accuracy = totalCorrect / totalQuestions;
    if (accuracy >= 0.9) return 3;
    if (accuracy >= 0.7) return 2;
    return 1;
}

/** Gemas de Sabiduría otorgadas según las estrellas conseguidas. */
export function calculateGems(stars: 1 | 2 | 3): number {
    const table: Record<1 | 2 | 3, number> = { 1: 5, 2: 10, 3: 20 };
    return table[stars];
}
