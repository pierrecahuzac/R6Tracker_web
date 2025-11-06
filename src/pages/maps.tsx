import axios from "axios";
import { useGameContext } from "../contexts/gameContext";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import "../styles/maps.scss";

const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL;

interface MapData {
    name: string;
    nameFr: string;
    id: string;
    url?: string;
}

const Maps = () => {
    const { game, setGame, player, setPlayer } = useGameContext();
    const navigate = useNavigate();
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    const fetchMaps = async () => {
        const response = await axios.get(`${baseAPIURL}/map/getAll`, {
            withCredentials: true
        });
        return response.data;
    };

    const {
        data: mapsData,
        isLoading,
        error
    } = useQuery<MapData[]>({
        queryKey: ['maps'],
        queryFn: fetchMaps
    });

    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        if (mapsData && mapsData.length > 0) {
            setShouldAnimate(false);
            requestAnimationFrame(() => {
                setShouldAnimate(true);
            });
            ;
        }
    }, [mapsData]);

    const updateGame = async (mapChosen: string) => {
        const response = await axios.put(
            `${baseAPIURL}/game/update/${game.id}`,
            {
                data: {
                    map: mapChosen,
                }
            },
            {
                withCredentials: true
            }
        );
        return response.data;
    };

    const handleChooseMap = async (mapName: string, id: string) => {
        setIsUpdating(true);
        setUpdateError(null);

        try {
            await updateGame(mapName);
            setGame({
                ...game,
                map: {
                    name: mapName,
                    id
                }
            });
            navigate("/sideChoice");
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la partie:", error);
            setUpdateError("Impossible de sélectionner cette carte. Veuillez réessayer.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Sélectionnez une carte</h2>
                {player.isLoggedIn && (
                    <div className="home__language-choice">
                        <button
                            className="home__language-fr"
                            onClick={() => setPlayer({ ...player, language: "Fr" })}
                        >
                            Fr
                        </button>
                        <button
                            className="home__language-en"
                            onClick={() => setPlayer({ ...player, language: "En" })}
                        >
                            En
                        </button>
                    </div>
                )}
            </div>

            {isLoading && <div>Chargement des cartes...</div>}
            {error && <p>Erreur de chargement des cartes.</p>}
            {updateError && (
                <div style={{
                    padding: '1rem',
                    backgroundColor: '#fee',
                    border: '1px solid #fcc',
                    borderRadius: '4px',
                    marginBottom: '1rem',
                    color: '#c00'
                }}>
                    {updateError}
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                opacity: isUpdating ? 0.5 : 1,
                pointerEvents: isUpdating ? 'none' : 'auto'
            }}>
                {mapsData && mapsData.map((map, index) => (
                    <div
                        className="button__map"
                        key={map.id}
                        onClick={() => handleChooseMap(map.name, map.id)}
                        style={{
                            width: "100%",
                            height: "120px",
                            position: "relative",
                            overflow: "hidden",
                            padding: 0,
                            border: '3px solid transparent',
                            cursor: isUpdating ? 'not-allowed' : 'pointer',
                            transition: 'border-color 0.2s',
                            ...(shouldAnimate && {
                                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                            }),
                        }}
                        onMouseOver={(e) => !isUpdating && (e.currentTarget.style.borderColor = '#ca0b0b')}
                        onMouseOut={(e) => (e.currentTarget.style.borderColor = 'transparent')}
                    >
                        {map.url && (
                            <img
                                src={map.url}
                                alt={`Image de la carte ${player.language === "Fr" ? map.nameFr : map.name}`}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    opacity: 0.7,
                                }}
                            />
                        )}
                        <span
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                color: "white",
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "4px",
                                fontWeight: "bold",
                                fontSize: "1.1rem",
                                textShadow: "1px 1px 2px black",
                                textTransform: "uppercase"
                            }}
                        >
                            {player.language === "Fr" ? map.nameFr : map.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Maps;