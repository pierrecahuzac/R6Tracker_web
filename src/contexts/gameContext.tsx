import { createContext, useContext, useEffect, useState  } from "react";
import axios from "axios";

import { fetchUser } from "../functions/player";
import type { PlayerData } from "../type/playerData";
import type { GameData } from "../type/gameData";
import type { RoundData } from "../type/roundData";
import type { ScoreData } from "../type/scoreData";
import type { GameMode } from "../type/gameMode";
import type { GameContextType } from "../type/gameContext";


const initialPlayer: PlayerData = {
    id: "",
    username: "",
    email: "",
    isLoggedIn: false,
    language: "Fr",
    activeGameId: null,
};

const initialRound: RoundData = {
    id: "",
    gameId: "",
    roundNumber: 0,
    sideId: "",
    sideName: "",
    winningSideId: null,
    operatorId: null,
    kills: 0,
    death: false,
    assists: 0,
    disconnected: false,
    points: 0,
    roundResult: "",
};

const initialGame: GameData = {
    id: "",
    createdAt: "",
    date: "",
    map: null,
    platformId: null,
    playerId: "",
    accountId: "",
    playerScore: 0,
    opponentScore: 0,
    resultId: null,
    overtime: false,
    updatedAt: null,
    gameMode: null,
};

const initialScore: ScoreData = {
    playerScore: 0,
    opponentScore: 0,
};


const initialContextValue: GameContextType = {
    player: initialPlayer,
    setPlayer: () => { },
    game: initialGame,
    setGame: () => { },
    mapChosen: "",
    setMapChosen: () => { },
    round: initialRound,
    setRound: () => { },
    score: initialScore,
    setScore: () => { },
    setGameMode: () => { },
    loading: true,
    setLoading: () => { },
};

const GameContext = createContext<GameContextType>(initialContextValue);

const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL;


interface GameProviderProps {
    children: React.ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {

    const [mapChosen, setMapChosen] = useState("");

    const [player, setPlayer] = useState<PlayerData>(initialPlayer);
    const [game, setGame] = useState<GameData>(initialGame);
    const [round, setRound] = useState<RoundData>(initialRound);
    const [score, setScore] = useState<ScoreData>(initialScore);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            setLoading(true);
            try {
                const userFetched: any = await fetchUser(setPlayer);
                const activeGameId = userFetched?.data?.player?.activeGame?.gameId;
                if (activeGameId) {
                    try {
                        const response = await axios.get(
                            `${baseAPIURL}/game/${activeGameId}`,
                            {
                                withCredentials: true,
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            }
                        );                        
                        setGame(response.data.gameById);
                    } catch (error) {
                        console.log("Erreur lors du fetch de la partie active (peut être 404 si inactive):", error);
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la restauration de la session:", error);
            } finally {
                setLoading(false);
            }
        };
        restoreSession();
    }, []);


    const setGameMode = (modeName: string) => {
        setGame((prev) => ({ ...prev, gameMode: modeName as unknown as GameMode }));
    };

    const value: GameContextType = {
        setGameMode,
        round,
        setRound,
        score,
        setScore,
        player,
        setPlayer,
        game,
        setGame,
        loading,
        setLoading,
        mapChosen,
        setMapChosen,
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error(
            "useGameContext doit être utilisé à l'intérieur d'un GameProvider."
        );
    }
    return context;
};