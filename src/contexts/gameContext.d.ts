import type { ReactNode } from "react";
import type { Player } from "../type/player";
import type { Round } from "../type/round";
import type { Game } from "../type/game";
import type { Score } from "../type/score";

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


