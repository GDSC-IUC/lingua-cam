/**
 * Système de niveaux progressifs pour Nkolo.
 * 
 * Chaque niveau nécessite plus d'XP que le précédent :
 *   Niveau 1 → 2 : 100 XP
 *   Niveau 2 → 3 : 200 XP
 *   Niveau 3 → 4 : 300 XP
 *   ...etc
 * 
 * Seuil cumulé pour atteindre le niveau n : 50 * n * (n - 1)
 *   Niveau 1 :    0 XP
 *   Niveau 2 :  100 XP
 *   Niveau 3 :  300 XP
 *   Niveau 4 :  600 XP
 *   Niveau 5 : 1000 XP
 *   Niveau 6 : 1500 XP
 *   Niveau 7 : 2100 XP
 *   Niveau 8 : 2800 XP
 *   Niveau 9 : 3600 XP
 *   Niveau 10: 4500 XP
 */

/** Retourne le seuil XP cumulé pour atteindre le niveau n */
export function xpThresholdForLevel(level: number): number {
  return 50 * level * (level - 1);
}

/** Retourne le niveau actuel en fonction du total d'XP */
export function getLevel(totalXp: number): number {
  // Résolution de 50*n*(n-1) <= totalXp
  // => n <= (1 + sqrt(1 + 4*totalXp/50)) / 2
  const n = (1 + Math.sqrt(1 + (4 * totalXp) / 50)) / 2;
  return Math.floor(n);
}

/** Retourne l'XP nécessaire pour passer au niveau suivant */
export function xpForNextLevel(totalXp: number): number {
  const currentLevel = getLevel(totalXp);
  const nextThreshold = xpThresholdForLevel(currentLevel + 1);
  return nextThreshold - totalXp;
}

/** Retourne la progression (0-1) vers le prochain niveau */
export function levelProgress(totalXp: number): number {
  const currentLevel = getLevel(totalXp);
  const currentThreshold = xpThresholdForLevel(currentLevel);
  const nextThreshold = xpThresholdForLevel(currentLevel + 1);
  const range = nextThreshold - currentThreshold;
  if (range === 0) return 1;
  return (totalXp - currentThreshold) / range;
}
