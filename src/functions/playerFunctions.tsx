import axios from "axios";
import type { Player } from "../type/player";
import type { NavigateFunction } from "react-router-dom";

const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL;
export const logout = async (
  setPlayer: (value: Player) => void,
  navigate: NavigateFunction
) => {
  try {
    const response = await axios.post(
      `${baseAPIURL}/player/logout`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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

export const fetchUser = async (setPlayer: (value: Player) => void) => {
  try {
    const response = await axios.get(`${baseAPIURL}/auth/me`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (
      response.status === 200 &&
      response.data.message === "player connected"
    ) {
      setPlayer({
        id: response.data.player.id,
        username: response.data.player.username,
        email: response.data.player.email ?? "",
        isLoggedIn: true,
        language: response.data.player.language,
        activeGameId: response.data.player.activeGameId ?? "",
      });
      localStorage.setItem("playerId", response.data.player.id);
      localStorage.setItem("username", response.data.player.username);
      localStorage.setItem("language", response.data.player.language);
     
      if (response.data.player.activeGameId !== null || response.data.player.activeGameId !== "") {
        localStorage.setItem("activeGameId", response.data.player.activeGameId);
      }
      return response;
    }
    return;
  } catch (error) {
    setPlayer({
      id: "",
      username: "",
      email: "",
      isLoggedIn: false,
      language: "Fr",
      activeGameId: "",
    });
    throw error;
  }
};
