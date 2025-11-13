import type { ReactNode } from "react";
import type { Player } from "../type/player";
import type { Round } from "../type/round";
import type { Game } from "../type/game";
import type { Score } from "../type/score";
import type GameContextValue from '../type/gameContextValue'

export declare const GameProvider: ({ children }: { children: ReactNode }) => JSX.Element;
export declare const useGameContext: () => GameContextValue;


export interface GameContextType {
    player: PlayerData;
    setPlayer: Dispatch<SetStateAction<PlayerData>>;
    game: GameData;
    setGame: Dispatch<SetStateAction<GameData>>;
    round: RoundData;
    setRound: Dispatch<SetStateAction<RoundData>>;
    score: ScoreData;
    setScore: Dispatch<SetStateAction<ScoreData>>;
    setGameMode: (modeName: string) => void;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    mapChosen: string; 
    setMapChosen: Dispatch<SetStateAction<string>>;
}