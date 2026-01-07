import axios from "axios";
import { useEffect, useState } from "react";
import { useGameContext } from "../contexts/gameContext.tsx";

// Assurez-vous que ce chemin est correct pour votre projet
import { useWindowSize } from "../hooks/useWindowsSize";
import baseURL from "../functions/baseURL.tsx"
// --- Interfaces TypeScript ---
interface OperatorData {
    name: string;
    icon: string;
}

interface SideData {
    name: string;
}

interface RoundData {
    id: string;
    roundNumber: number;
    death: boolean;
    disconnected: boolean;
    kills: number;
    assists: number;
    points: number;
    roundResult: 'WIN' | 'LOSS' | string;
    operator: OperatorData | null;
    side: SideData;
}

interface GameData {
    id: string;
    mode: { name: string };
    map: { nameFr: string, name: string, url: string };
    overtime: boolean;
    playerScore: number;
    opponentScore: number;
    createdAt: string;
    rounds: RoundData[];
   
}

import '../styles/stats.scss'
import ReturnButton from "../ui/returnButton.tsx";



const Stats = () => {
    const { player } = useGameContext();
    const [allUserGames, setAllUserGames] = useState<GameData[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    const { width } = useWindowSize();
    const isLargeScreen = width && width > 720;



    const getAllPlayerGames = async () => {
        if (!player.id) return;
        setIsLoading(true);
        try {
            const response = await axios.get(`${baseURL}/game/findGamesByPlayerId`, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });            
            setAllUserGames(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des parties:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (player.id) {
            getAllPlayerGames();
            
            
        }
    }, [player.id])



    if (isLoading || !width) {
        return <div className="stats"><h2>Mes stats</h2><p>Chargement des statistiques...</p></div>;
    }

    return (
        <div className="stats">
            <ReturnButton />
            <h2>Mes stats</h2>


            {allUserGames && allUserGames?.length === 0 && (
                <p>Aucune partie trouvée pour le moment. Jouez pour voir vos statistiques ici !</p>
            )}

            {allUserGames.length >0  && allUserGames.map((game) => (
                <div key={game?.id} className="stats__game-summary">
                    {/* Détails du match */}
                    <div>Type de partie : {game?.mode?.name}</div>
                    <div>Créée le: {new Date(game?.createdAt).toLocaleString("fr")}</div>

                    <div>
                        Carte: {player.language === "Fr" ? game?.map?.nameFr.toLowerCase() : game?.map?.name?.toLowerCase()}
                        <div className="stats__map-image">
                            <img
                                src={game?.map?.url}
                                alt={`image de la carte ${game?.map?.name}`}
                            />
                        </div>
                    </div>

                    <div>Prolongations: {game?.overtime ? "Oui" : "Non"}</div>
                    <div>Score Joueur: {game?.playerScore} - Adversaire: {game?.opponentScore}</div>

                    <h4 style={{ color: game?.opponentScore > game?.playerScore ? 'red' : 'green' }}>
                        {game?.opponentScore > game?.playerScore ? "DÉFAITE" : "VICTOIRE"}
                    </h4>

                    {/* Détails des rounds (Tableau) */}
                    {game?.rounds && game?.rounds.length > 0 && (
                        <div className="stats__rounds-details">
                            <h4>Détails des rounds:</h4>

                            <table className='stats__score-table'>
                                <thead className='stats__score-table_table-head'>
                                    <tr>
                                        <th>{isLargeScreen ? "Résultat" : "R"}</th>
                                        <th>{isLargeScreen ? "Round" : "#"}</th>
                                        <th>{isLargeScreen ? "Mort" : "M"}</th>
                                        <th>{isLargeScreen ? "Déconnecté" : "D"}</th>
                                        <th>{isLargeScreen ? "Tué" : "T"}</th>
                                        <th>{isLargeScreen ? "Assistances" : "A"}</th>
                                        <th>{isLargeScreen ? "Opérateur" : "O"}</th>
                                        <th>{isLargeScreen ? "Côté" : "S"}</th>
                                        <th>{isLargeScreen ? "Points" : "Pts"}</th>
                                    </tr>
                                </thead>

                                <tbody className='stats__score-table_table-body'>
                                    {game?.rounds.map((round, index: number) => (
                                        <tr className='stats__score-table_table-raw' key={round.id || index}>
                                            {/* Colonne Résultat du round */}
                                            <td style={{ backgroundColor: round.roundResult === 'WIN' ? 'rgba(0, 128, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)' }}>
                                                {round.roundResult === 'Victory' ? '✅' : '❌'}
                                            </td>

                                            <td className='stats__score-table_table-d'>{round.roundNumber}</td>

                                            {/* Icônes pour Mort et Déconnecté */}
                                            <td className='stats__score-table_table-d'>{round.death ? "💀" : "❤️"}</td>
                                            <td className='stats__score-table_table-d'>{round.disconnected ? "🔌" : "🟢"}</td>

                                            <td className='stats__score-table_table-d'>{round.kills}</td>
                                            <td className='stats__score-table_table-d'>{round.assists}</td>

                                            <td className='stats__score-table_table-d'>
                                                <img
                                                    className="stats__score-table-icon-operator"
                                                    src={round.operator?.icon}
                                                    alt={round.operator?.name}
                                                    title={round.operator?.name}
                                                />
                                            </td>

                                            {/* Affichage du côté (première lettre) */}
                                            <td className='stats__score-table_table-d'>
                                                {round.side.name?.charAt(0)}
                                            </td>

                                            <td className='stats__score-table_table-d'>{round.points}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default Stats;