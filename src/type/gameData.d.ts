export interface GameData {
    id: string;
    createdAt: string;
    date: string;
    map: GameMap | null; 
    platformId: string | null;
    playerId: string;
    accountId: string;
    playerScore: number;
    opponentScore: number;
    resultId: string | null;
    overtime: boolean;
    updatedAt: string | null;
    gameMode: GameMode | null;
}
