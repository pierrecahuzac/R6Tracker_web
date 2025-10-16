import axios from "axios";

import { useQuery, } from "@tanstack/react-query";

import { useGameContext } from "../contexts/gameContext";
import { useNavigate } from "react-router-dom";



const NewGame = () => {
    document.title = "Nouvelle partie";
    const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL


    const { game, setGame } = useGameContext()


    const fetchGameModes = async (): Promise<{ id: string; name: string }[]> => {
        const response = await axios.get(`${baseAPIURL}/gameMode/getAll`);
        console.log(response.data);
        
        return response.data;
    }


    const query = useQuery<{ id: string; name: string }[]>({
        queryKey: ['gameModes'],
        queryFn: fetchGameModes
    })
    const navigate = useNavigate()

    const updateGame = async (modeName: string) => {

        try {
            await axios.put(`${baseAPIURL}/game/update/${game.id}`, {
                data: {
                    gameMode: modeName,
                }
            });

            navigate("/maps")

        } catch (error) {
            console.log(error);
            return
        }

    }
    const onChooseGameMode = async (gameMode: { id: string, name: string }): Promise<void> => {


        setGame({
            ...game,

            gameMode: {
                id: gameMode.id,
                name: gameMode.name
            }

        });
        await updateGame(gameMode.name)

    }
    return (
        <div>
            <p>Nouvelle partie</p>
            <p>{game.id}</p>
            {query.isLoading && <p>Chargement...</p>}
            {query.isError && <p>Erreur de chargement</p>}
            {query.data && query.data.map((mode) => (
                <button key={mode.id ?? mode.name} onClick={() => onChooseGameMode(mode)} >{mode.name}</button>
            ))}
        </div>

    )

}

export default NewGame