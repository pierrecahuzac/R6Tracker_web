import type { ReactNode } from "react";

export interface Player {
  id: string;
  username: string;
  email: string;
  isLoggedIn: boolean;
  language: string
}

export interface Round {
  id: string;
  gameId: string;
  roundNumber: number;
  sideId: string;
  sideName: string;
  winningSideId: string;
  operatorId: string;
  kills: number;
  death: boolean;
  assists: number;
  disconnected: boolean;
  points: number;
  result: string;
  isFinished: boolean
}

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

export interface Score {
  playerScore: number;
  opponentScore: number;
}

export interface GameContextValue {
  player: Player;
  setPlayer: (value: Player) => void;
  game: Game;
  setGame: (value: Game) => void;
  gameModeChosen: string;
  setGameModeChosen: (value: string) => void;
  round: Round;
  setRound: (value: Round) => void;
  score: Score;
  setScore: (value: Score) => void;
}

export declare const GameProvider: ({ children }: { children: ReactNode }) => JSX.Element;
export declare const useGameContext: () => GameContextValue;


