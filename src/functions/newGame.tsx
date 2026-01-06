import axios from "axios";
import { type NavigateFunction } from "react-router";

export const createNewGame = async (
  player: { id: string },
  setGame: any,
  navigate: NavigateFunction
) => {
  const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL;
  try {
    const response = await axios.post(
      `${baseAPIURL}/game/create`,
      {
        playerId: player.id,
      },
      {
        withCredentials: true,
      }
    );
    console.log(response);
    
    localStorage.setItem("gameId", response.data.id);
    localStorage.setItem("activeGameId", response.data.game.id);
    localStorage.setItem("playerId", response.data.updateActiveGamePlayerplayer.id);
    setGame(response.data);
    navigate("./game-mode-choice");
  } catch (error) {
    console.log(error);
  }
};
