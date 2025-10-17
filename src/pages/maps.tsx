import axios from "axios";
import { useGameContext } from "../contexts/gameContext";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL

const Maps = () => {
    const { game, setGame, player } = useGameContext()

    const fetchMaps = async () => {
        const response = await axios.get(`${baseAPIURL}/map/getAll`);
        console.log(response);

        return response.data;
    }
    const {
        data: mapsData,
        isLoading,
        error
    } = useQuery({
        queryKey: ['maps'],
        queryFn: fetchMaps
    })



    const updateGame = async (mapChosen: string) => {

        try {
            await axios.put(`${baseAPIURL}/game/update/${game.id}`, {
                data: {
                    map: mapChosen,
                }
            })


        } catch (error) {
            console.log(error);
            return
        }

    }
    const navigate = useNavigate()

    const handleChooseMap = async (mapName: string, id: string) => {
        setGame({
            ...game,
            map: {
                name: mapName,
                id
            }
        })
        await updateGame(mapName)
        navigate("/sideChoice")
    }


    const playerLanguage = player.language
    return (
        <div>
            <div>Liste des cartes</div>
            {isLoading && <div>Chargement...</div>}
            {error && <p>Erreur de chargement</p>}
            {mapsData && mapsData.map((map: { name: string, nameFr: string, id: string }) => (
                playerLanguage === "Fr" ? (
                    <button
                        title={map.nameFr}
                        key={map.id}
                        onClick={() => handleChooseMap(map.name, map.id)}
                    />
                ) : (
                    <button
                        title={map.name}
                        key={map.id}
                        onClick={() => handleChooseMap(map.name, map.id)}
                    />
                )
            ))}
        </div>
    )
}

export default Maps