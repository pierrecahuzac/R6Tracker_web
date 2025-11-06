import axios from "axios"
import { useEffect, useState } from "react"
import { useGameContext } from "../contexts/gameContext";

// Interfaces omises pour la concision ici, mais elles sont essentielles pour TypeScript!
import '../styles/stats.scss'
const Stats = () => {
    const { player } = useGameContext();
    const [games, setGames] = useState<any[]>([]); // Utilisez GameData[]


    const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL;
    
    const getAllPlayerGames = async () => {
        if (!player.id) return;

        try {
            const response = await axios.get(`${baseAPIURL}/game/findGamesByPlayerId/${player.id}`, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
            setGames(response.data.games);
        } catch (error) {
            console.error("Erreur lors du chargement des parties:", error);
        }
    }

    useEffect(() => {
        if (player.id) {
            getAllPlayerGames();
        }
    }, [player.id])

    return (
        <div className="stats">
            <h2>Mes stats</h2>
            {
                games.map((game: any) => (
                    
                    <div key={game.id} > 
                        
                        <div>Type de partie : {game.mode.name}</div>
                        <div>Créée le: {new Date(game.createdAt).toLocaleString("fr")}</div>

                        <div>Carte: {player.language === "Fr" ? game?.map?.nameFr?.toLowerCase() : game?.map?.name?.toLowerCase()}
                           
                            <div className="stats__map-image"><img  
                                src={game?.map?.url} 
                                alt={`image de la carte ${game?.map?.name}`} 
                            /></div>
                            
                        </div>

                        <div>Prolongations: {game.overtime ? "Oui" : "Non"}</div>
                        <div>Score Joueur: {game.playerScore} - Adversaire: {game.opponentScore}</div>

                        <h4 style={{ color: game.opponentScore > game.playerScore ? 'red' : 'green' }}>
                            {game.opponentScore > game.playerScore ? "DÉFAITE" : "VICTOIRE"}
                        </h4>

                        {game?.rounds && game.rounds.length > 0 && (
                            
                            <div> 
                                <h4>Détails des rounds:</h4>
                                
                                <table className='stats__score-table'> 
                                    
                                    <thead className='stats__score-table_table-head'>
                                        <tr>
                                            <th>Round</th>
                                            <th>Mort</th>
                                            <th>Déconnecté</th>
                                            <th>Tué</th>
                                            <th>Assistances</th>
                                            <th>Opérateur</th>
                                            <th>Points</th>
                                        </tr>
                                    </thead>
                                    
                                    <tbody className='stats__score-table_table-body'>
                                        {game.rounds.map((round: any, index: number) => (
                                            <tr className='stats__score-table_table-raw' key={round.id || index}>
                                                {/* Les styles 'textAlign: "center"' et les bordures sont maintenant gérés par CSS */}
                                                 <td className='stats__score-table_table-d'>{round?.roundNumber}</td>
                                                 <td className='stats__score-table_table-d'>{round?.death ? "Oui" : "Non"}</td>
                                                 <td className='stats__score-table_table-d'>{round?.disconnected ? "Oui" : "Non"}</td>
                                                 <td className='stats__score-table_table-d'>{round?.kills}</td>
                                                 <td className='stats__score-table_table-d'>{round?.assists}</td>
                                                 <td className='stats__score-table_table-d'>
                                                    <img className="stats__score-table-icon-operator"
                                                        src={round?.operator?.icon}
                                                        alt={round?.operator?.name}
                                                    />
                                                </td>
                                                 <td className='stats__score-table_table-d'>{round?.points}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ))
            }
        </div>
    )
}

export default Stats