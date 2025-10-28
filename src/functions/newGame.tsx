import axios from "axios";
import { type NavigateFunction } from "react-router";


export const createNewGame = async (
    player: { id: string },
    setGame: any,
    navigate: NavigateFunction
) => {

    const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL;
    try {
        const response = await axios.post(`${baseAPIURL}/game/create`, {
            playerId: player.id,

        }, {
            withCredentials: true
        });
        if (response.status === 201) {
            setGame(response.data);

            navigate("./newGame");
        }
    } catch (error) {

    }

};

