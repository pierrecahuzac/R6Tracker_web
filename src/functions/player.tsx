import axios from "axios";
import type { Player } from "../type/player";
import type { NavigateFunction } from "react-router-dom";

const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL
export const logout = async (
    setPlayer: (value: Player) => void,
    navigate: NavigateFunction
) => {
    try {
        const response = await axios.post(`${baseAPIURL}/player/logout`, {}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            setPlayer({
                id: "",
                username: "",
                email: "",
                isLoggedIn: false,
                language: 'Fr'
            })
            navigate('/')
        }
        return

    } catch (e) {
        console.log(e);
    }
};

export const fetchUser = async (setPlayer: (value: Player) => void) => {
    try {
        const response = await axios.get(`${baseAPIURL}/auth/me`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200 && response.data.message === "player connected") {
            setPlayer({
                id: response.data.playerId,
                username: response.data.username,
                email: "",
                isLoggedIn: true,
                language: 'Fr'
            })
            return
        }

    } catch (error) {
        setPlayer({ id: "", username: "", email: "", isLoggedIn: false, language: 'Fr' });
        throw error;


    }
}

