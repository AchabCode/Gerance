export const calculateTotalBankroll = (items: { amount: number }[]): number => {
  return items.reduce((total, item) => total + (item.amount || 0), 0);
};

export const calculateHourlyRate = (
  bb_amount: number,
  bb_per_hour: number,
  rakeback_hourly: number
): number => {
  return (bb_amount * bb_per_hour) + rakeback_hourly;
};

export const getRandomMotivationalMessage = (): string => {
  const messages = [
    "Joue ton A-Game aujourd'hui. Reste concentré.",
    "La variance est temporaire, le skill est permanent.",
    "Décide de gagner avant même de t'asseoir à la table.",
    "Ton edge n'est pas dans les mains que tu gagnes, mais dans les erreurs que tu évites.",
    "Fais confiance à ton processus, pas à tes résultats à court terme.",
    "Le meilleur joueur n'est pas celui qui bluff le plus, mais celui qui prend les meilleures décisions.",
    "Chaque session est une opportunité d'apprendre et de progresser.",
    "La discipline est la clé du succès à long terme.",
    "Ne laisse pas tes émotions dicter tes décisions.",
    "Rappelle-toi pourquoi tu as commencé et reste fidèle à ta stratégie.",
  ];

  return messages[Math.floor(Math.random() * messages.length)];
};