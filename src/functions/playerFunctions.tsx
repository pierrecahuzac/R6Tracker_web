import axios from "axios";
import type { Player } from "../type/player";
import type { NavigateFunction } from "react-router-dom";
import baseURL from './baseURL'
import type { PlayerData } from "../type/playerData";



export const logout = async (
  setPlayer: (value: Player) => void,
  navigate: NavigateFunction
) => {
  try {
    const response = await axios.post(
      `${baseURL}/player/logout`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);

    if (response.status === 200) {
      setPlayer({
        id: "",
        username: "",
        email: "",
        isLoggedIn: false,
        language: "Fr",
        activeGameId: "",
      });
      navigate("/");
    }
    return;
  } catch (e) {
    console.log(e);
  }
};

export const fetchUser = async () => {
  const response = await axios.get(`${baseURL}/auth/me`, {
    withCredentials: true,
  });
console.log(response);

  if (response.status === 200 && response.data.player) {
    // On formate l'objet pour qu'il corresponde à notre type PlayerData
    const userData = {
      id: response.data.player.id,
      username: response.data.player.username,
      email: response.data.player.email ?? "",
      isLoggedIn: true,
      language: response.data.player.language,
      activeGameId: response.data.player.activeGameId ?? "",
    };

    // On gère le localStorage ici car c'est lié à la donnée
    localStorage.setItem("playerId", userData.id);
    localStorage.setItem("username", userData.username);
    console.log(userData);
    
    return userData; 
  }
  
  return null;
};