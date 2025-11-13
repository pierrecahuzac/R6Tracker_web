export interface RoundData {
    id: string;
    gameId: string;
    roundNumber: number;
    sideId: string;
    sideName: string;
    winningSideId: string | null;
    operatorId: string | null;
    kills: number;
    death: boolean;
    assists: number;
    disconnected: boolean;
    points: number;
    roundResult: string;
}