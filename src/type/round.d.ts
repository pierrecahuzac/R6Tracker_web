export interface Round {
  id: string;
  gameId: string;
  roundNumber: number;
  sideId: string;
  sideName: string;
  winningSideId: string;
  operatorId: string;
  side?: 'ATTACK' | 'DEFENSE';
  operator?: { id: string; name: string; icon?: string; image?: string };
  kills: number;
  death: boolean;
  assists: number;
  disconnected: boolean;
  points: number;
  result: string;
  roundResult?: 'Victory' | 'Defeat' | 'Draw' | null;
  isFinished: boolean;
}


