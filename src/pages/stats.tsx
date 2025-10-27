import axios from "axios"
import { useEffect } from "react"
import { useGameContext } from "../contexts/gameContext";

const Stats = () => {
    const { player } = useGameContext();
 
    
    const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL;
    const getAllPlayerGames = async () => {
        try {
            const response = await axios.get(`${baseAPIURL}/game/findGamesByPlayerId/${player.id}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }
    const fetchDatas = () => {
        getAllPlayerGames()
    }
    useEffect(() => {
        if (player.id !== null) {
            fetchDatas()
        }
    })
    return (
        <div className="stats">
            Mes stats
        </div>
    )
}



export default Stats