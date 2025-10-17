import axios from "axios";
import { useGameContext } from "../contexts/gameContext";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
// 💡 IMPORTANT : Importez votre fichier SCSS/CSS ici
import '../styles/maps.scss'; 

const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL

// Définition de l'interface pour les données des cartes
interface MapData {
    name: string;
    nameFr: string;
    id: string;
    url?: string; 
}

const Maps = () => {
    const { game, setGame, player } = useGameContext()
    const navigate = useNavigate()

    const fetchMaps = async () => {
        const response = await axios.get(`${baseAPIURL}/map/getAll`);
        return response.data;
    }

    const {
        data: mapsData,
        isLoading,
        error
    } = useQuery<MapData[]>({
        queryKey: ['maps'],
        queryFn: fetchMaps
    })

    const updateGame = async (mapChosen: string) => {
        // ... (le corps de la fonction reste inchangé) ...
        try {
            await axios.put(`${baseAPIURL}/game/update/${game.id}`, {
                data: {
                    map: mapChosen,
                }
            })
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la partie:", error);
        }
    }

    const handleChooseMap = async (mapName: string, id: string) => {
        // ... (le corps de la fonction reste inchangé) ...
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
        // 💡 Utilisation de la classe CSS pour le conteneur principal
        <div className="maps-container"> 
            <h2>Sélectionnez une carte</h2>
            {isLoading && <div>Chargement des cartes...</div>}
            {error && <p>Erreur de chargement des cartes.</p>}
            
            {/* 💡 Utilisation de la classe CSS pour la grille */}
            <div className="maps-grid">
                {mapsData && mapsData.map((map) => {
                    const mapDisplayName = playerLanguage === "Fr" ? map.nameFr : map.name;

                    return (
                        <button
                            className="button__map" // 💡 Classe pour le bouton
                            key={map.id}
                            onClick={() => handleChooseMap(map.name, map.id)}
                            // 💡 Suppression des styles en ligne (sauf `onMouseOver`/`onMouseOut` si vous voulez les garder, mais je les ai mis dans le SCSS avec `:hover`)
                            // J'ai enlevé les `onMouseOver`/`onMouseOut` car ils sont gérés par le `:hover` dans le SCSS
                        >
                            {/* 1. Image de fond */}
                            {map.url && (
                                <img
                                    src={map.url}
                                    alt={`Image de la carte ${mapDisplayName}`}
                                    // 💡 Suppression des styles en ligne
                                />
                            )}
                            
                            {/* 2. Nom de la carte au centre */}
                            <span
                                // 💡 Suppression des styles en ligne
                            >
                                {mapDisplayName}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default Maps