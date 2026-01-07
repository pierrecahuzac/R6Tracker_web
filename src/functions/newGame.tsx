import axios from "axios";
import { type NavigateFunction } from "react-router";
import baseURL from "./baseURL";

export const createNewGame = async (
  player: { id: string },
  setGame: any,
  navigate: NavigateFunction
) => {
 console.log('coucou');
 
  try {
    const response = await axios.post(
      `${baseURL}/game/create`,
      {
        playerId: player.id,
      },
      {
        withCredentials: true,
      }
    );


    localStorage.setItem("gameId", response.data.game.id);
    localStorage.setItem("activeGameId", response.data.game.id);
    localStorage.setItem("playerId", response.data.updateActiveGamePlayer.id);
    setGame(response.data);
    navigate("./game-mode-choice");
  } catch (error) {
    console.log(error);
  }
};
