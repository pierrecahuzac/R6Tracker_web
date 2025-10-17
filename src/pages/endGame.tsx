import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
// Importations de l'environnement et des hooks
import { useGameContext } from "../contexts/gameContext";
import useToast from "../hooks/useToast";

import '../styles/end-game.scss';

// --- Définitions de types pour une meilleure robustesse ---

// 1. Type de l'objet Round tel que reçu de l'API
type RoundData = {
    kills: number;
    assists: number;
    points: number;
    death: boolean;
    disconnected: number;
    roundResult: 'Victory' | 'Defeat' | 'Draw' | null;
    isFinished: boolean;
}

// 2. Type pour l'état agrégé des statistiques
type GameStats = {
    totalKills: number;
    totalAssists: number;
    totalPoints: number;
    totalDeaths: number;
    totalRounds: number;
    totalDisconnected: number;
    playerScore: number;
    opponentScore: number;
}

// État initial (utilisé deux fois, donc défini en dehors du composant)
const initialStats: GameStats = {
    totalKills: 0,
    totalAssists: 0,
    totalPoints: 0,
    totalDeaths: 0,
    totalRounds: 0,
    totalDisconnected: 0,
    playerScore: 0,
    opponentScore: 0
};

// --- Composant EndGame ---

const EndGame = () => {
    // Hooks et contextes
    const { game } = useGameContext();
    const { onError } = useToast();
    const navigate = useNavigate();

    // Récupération de l'URL de l'API de l'environnement
    const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL;

    // Utilisation de l'état avec le type GameStats
    const [statsForGame, setStatsForGame] = useState<GameStats>(initialStats);

    // L'ID de la partie est essentiel pour l'appel API
    const gameId = game?.id;

    // Logique d'agrégation des statistiques
    const aggregateStats = (rounds: RoundData[]): GameStats => {
        return rounds.reduce((acc, round) => {
            acc.totalKills += round.kills;
            acc.totalAssists += round.assists;
            acc.totalPoints += round.points;
            acc.totalDisconnected += round.disconnected;

            // Logique de score (plus concise)
            if (round.isFinished) {
                switch (round.roundResult) {
                    case 'Victory':
                        acc.playerScore += 1;
                        break;
                    case 'Defeat':
                        acc.opponentScore += 1;
                        break;
                    case 'Draw':
                        acc.playerScore += 1;
                        acc.opponentScore += 1;
                        break;
                    // Si roundResult est null, on n'ajoute rien (0)
                }
            }

            // Compte la mort
            if (round.death) {
                acc.totalDeaths += 1;
            }

            // Compte le nombre de rounds total
            acc.totalRounds += 1;

            return acc;
        }, { ...initialStats }); // Utilise une copie de l'état initial
    };

    // Fonction de récupération des données
    const getAllRoundsInGame = async () => {
        if (!gameId) {
            console.error("Game ID non disponible, impossible de récupérer les rounds.");
            return;
        }
        try {
            const response = await axios.get(`${baseAPIURL}/round/${gameId}`);
            const aggregatedStats = aggregateStats(response.data.result);
            setStatsForGame(aggregatedStats);
        } catch (error) {
            // Affichage de l'erreur via le hook useToast
            onError(`Erreur lors de la récupération des rounds: ${axios.isAxiosError(error) ? error.message : String(error)}`);
        }
    };

    // Utilisation de useEffect pour le chargement des données
    useEffect(() => {
        // Déclenche l'appel si l'ID de la partie est disponible
        if (gameId) {
            getAllRoundsInGame();
        }
    }, [gameId]); // Dépend de gameId

    // Rendu du composant
    return (
        <div className="end-game">
            <h1>Partie Terminée :</h1>
            <h2 className="end-game__score">Score : {statsForGame.playerScore} - {statsForGame.opponentScore}</h2>

            {statsForGame && (
                <div className="end-game__summary">
                    <div className="end-game__summary-title">Récapitulatif de la partie :</div>
                    {/* Le totalRounds correspond au nombre d'objets "round" dans le tableau. 
                        Si vous voulez afficher "Rounds joués", totalRounds est souvent la valeur correcte.
                        Si vous voulez le nombre de tours complétés, il faudrait le calculer.
                        J'ai retiré le "- 1" pour une lecture plus littérale du comptage dans la boucle.
                    */}
                    <div>Rounds enregistrés : {statsForGame.totalRounds}</div>
                    <div>Kills : {statsForGame.totalKills}</div>
                    <div>Assists : {statsForGame.totalAssists}</div>
                    <div>Morts : {statsForGame.totalDeaths}</div>
                    <div>Déconnexions : {statsForGame.totalDisconnected}</div>
                    <div>Points : {statsForGame.totalPoints}</div>
                </div>
            )}

            <button
                className="end-game__button"
                onClick={() => navigate('/newGame')}
            >
                Nouvelle partie
            </button>
            <button
                className="end-game__back-to-home"
                onClick={() => navigate('/')}
            >
                Accueil
            </button>
        </div>
    );
};

export default EndGame;