export interface Game {
  id: string;
  createdAt: string;
  date: string;
  map: any;
  platformId: any;
  playerId: string;
  accountId: string;
  playerScore: number;
  opponentScore: number;
  resultId: any;
  overtime: boolean;
  updatedAt: any;
  gameMode: { id: string; name: string } | null;
}


