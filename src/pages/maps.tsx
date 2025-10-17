import axios from "axios";
import { useGameContext } from "../contexts/gameContext";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL

// Définition de l'interface pour les données des cartes
interface MapData {
    name: string;
    nameFr: string;
    id: string;
    url?: string; // Ajout de l'URL pour l'image
}

const Maps = () => {
    const { game, setGame, player } = useGameContext()
    const navigate = useNavigate()

    const fetchMaps = async () => {
        const response = await axios.get(`${baseAPIURL}/map/getAll`);
        // Assurez-vous que l'URL est bien présente dans les données renvoyées par l'API
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
        try {
            await axios.put(`${baseAPIURL}/game/update/${game.id}`, {
                data: {
                    map: mapChosen,
                }
            })
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la partie:", error);
            // Retourner sans naviguer si l'API échoue
        }
    }

    const handleChooseMap = async (mapName: string, id: string) => {
        // Mise à jour rapide du contexte UI
        setGame({
            ...game,
            map: {
                name: mapName,
                id
            }
        })

        // Mise à jour de l'API
        await updateGame(mapName)
        
        // Navigation après la mise à jour (et si elle a réussi, selon updateGame)
        navigate("/sideChoice")
    }

    const playerLanguage = player.language

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Sélectionnez une carte</h2>
            {isLoading && <div>Chargement des cartes...</div>}
            {error && <p>Erreur de chargement des cartes.</p>}
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {mapsData && mapsData.map((map) => {
                    const mapDisplayName = playerLanguage === "Fr" ? map.nameFr : map.name;

                    return (
                        <button
                            key={map.id}
                            onClick={() => handleChooseMap(map.name, map.id)}
                            style={{
                                width: "100%",
                                height: "120px", // Hauteur augmentée pour mieux voir l'image
                                position: "relative",
                                overflow: "hidden", // Cache les parties de l'image qui pourraient dépasser
                                padding: 0,
                                border: '3px solid transparent',
                                cursor: 'pointer',
                                transition: 'border-color 0.2s',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.borderColor = '#ca0b0b')}
                            onMouseOut={(e) => (e.currentTarget.style.borderColor = 'transparent')}
                        >
                            {/* 1. Image de fond */}
                            {map.url && (
                                <img
                                    src={map.url}
                                    alt={`Image de la carte ${mapDisplayName}`}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover", // Assure que l'image couvre toute la zone
                                        opacity: 0.7, // Rendre l'image un peu sombre pour que le texte ressorte
                                    }}
                                />
                            )}
                            
                            {/* 2. Nom de la carte au centre */}
                            <span
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)", // Centre parfaitement l'élément
                                    color: "white",
                                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fond semi-transparent pour le texte
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "4px",
                                    fontWeight: "bold",
                                    fontSize: "1.1rem",
                                    textShadow: "1px 1px 2px black"
                                }}
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