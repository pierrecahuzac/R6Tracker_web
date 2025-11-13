export export interface GameContextValue {
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
  