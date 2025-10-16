import { createContext, useContext, useState } from "react";
/**
 * @typedef {Object} GameContextValue
 * @property {typeof initialPlayer} player
 * @property {(value: any) => void} setPlayer
 * @property {typeof initialGame} game
 * @property {(value: any) => void} setGame
 * @property {(value: string) => void} setGameMode
 * @property {string} mapChosen
 * @property {(value: string) => void} setMapChosen
 * @property {typeof initialRound} round
 * @property {(value: any) => void} setRound
 * @property {typeof initialScore} score
 * @property {(value: any) => void} setScore
 */

const initialPlayer = {
  id: "",
  username: "",
  email: "",
  isLoggedIn: false,
  language: 'Fr'
};

const initialRound = {
  id: "",
  gameId: "",
  roundNumber: 0,
  sideId: "",
  sideName: "",
  winningSideId: "",
  operatorId: "",
  kills: 0,
  death: false,
  assists: 0,
  disconnected: false,
  points: 0,
  roundResult: "",
};

const initialGame = {
  id: "",
  createdAt: "",
  date: "",
  map: {
    id: "",
    name: "",
  },
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

const initialScore = {
  playerScore: 0,
  opponentScore: 0,
};

/** @type {GameContextValue} */
const initialContextValue = {
  player: initialPlayer,

  setPlayer: (_value) => {},

  game: initialGame,

  setGame: (_value) => {},

  mapChosen: "",

  setMapChosen: (_value) => {},

  round: initialRound,

  setRound: (_value) => {},

  // Score
  score: initialScore,
  // setScore: () => {},
  setScore: (_value) => {},
};

/** @type {import('react').Context<GameContextValue>} */
const GameContext = createContext(initialContextValue);

export const GameProvider = ({ children }) => {
  const [player, setPlayer] = useState(initialPlayer);
  const [game, setGame] = useState(initialGame);
  const [round, setRound] = useState(initialRound);
  const [score, setScore] = useState(initialScore);

  const setGameMode = (modeName) => {
    setGame((prev) => ({ ...prev, gameMode: modeName }));
  };

  const value = {
    setGameMode,
    round,
    setRound,
    score,
    setScore,
    player,
    setPlayer,
    game,
    setGame,
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
