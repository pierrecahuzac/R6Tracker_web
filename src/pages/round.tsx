import { useGameContext } from "../contexts/gameContext";
import axios from "axios";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react"; // Ajout de l'import React si ce n'est pas déjà dans le contexte

// --- Types pour la réutilisation des boutons ---
type StatKey = 'kills' | 'assists' | 'death' | 'disconnected' | 'roundResult';

interface StatButtonProps {
    title: string;
    value: number | boolean | string;
    stat: StatKey;
    setRound: (newRound: any) => void;
    round: any; // Idéalement, utilisez le type de 'round' ici
}

/**
 * Composant réutilisable pour mettre à jour une stat spécifique (kills, assists, death, etc.).
 */
const StatButton = ({ title, value, stat, setRound, round }: StatButtonProps) => {
    // Détermine si le bouton est actuellement sélectionné (le statut est stocké dans round[stat])
    const isSelected = round[stat] === value;

    // Classes de base pour tous les boutons
    const baseClasses = "flex-grow min-w-[10%] mx-1 py-2 px-3 rounded-lg text-center font-medium transition duration-150 ease-in-out shadow-md border-2";

    // Classes spécifiques basées sur la sélection
    const selectedClasses = "bg-blue-600 border-blue-700 text-white hover:bg-blue-700";
    const defaultClasses = "bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200";

    return (
        <div className="flex-grow min-w-[10%] mx-1">
            <button
                className={`${baseClasses} ${isSelected ? selectedClasses : defaultClasses}`}
                onClick={() => {
                    setRound({
                        ...round,
                        [stat]: value // Utilisation d'une clé dynamique pour mettre à jour la stat
                    });
                }}
            >
                {title}
            </button>
        </div>
    );
};


const Round = () => {
    const { round, setRound, game } = useGameContext()


    const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL

    const statValues = [0, 1, 2, 3, 4, 5];
    const statValuesResult = ["Victory", "Defeat", "Draw"];

    const [statsForGame, setStatsForGame] = useState({
        totalKills: 0,
        totalAssists: 0,
        totalPoints: 0,
        totalDeaths: 0,
        totalRounds: 0,
        totalDisconnected: 0,
        playerScore: 0,
        opponentScore: 0
    })

    const navigate = useNavigate()
    
    // Fonction validRound inchangée (dépend de axios et des API)
    const validRound = async () => {
        try {
            const response = await axios.put(`${baseAPIURL}/round/update/${round.id}`, {
                round,
                isFinished: true
            })
            const { gameStatus, finalScore } = response.data;
            console.log(gameStatus, finalScore);


            if (gameStatus === 'PLAYER_WON' || gameStatus === 'PLAYER_LOST' || gameStatus === 'MATCH_DRAW') {
                console.log(('je suis là'));

                // Normalement ici il y aurait une alerte ou une modale (car Toast n'est pas importé et alert() est interdit)
                console.log(`Jeu terminé. Statut: ${gameStatus}. Score final: ${finalScore}`);
                navigate('/endGame')

                return
            }

            if (gameStatus === 'IN_PROGRESS' || gameStatus === 'OVERTIME') {
                // Mettre à jour le round pour le suivant
                //  @ts-ignore
                setRound({
                    id: '',
                    roundNumber: round.roundNumber + 1,
                    gameId: game.id,
                    sideId: "",
                    sideName: "",
                    winningSideId: "",
                    operatorId: "",
                    kills: 0,
                    death: false,
                    assists: 0,
                    disconnected: false,
                    points: 0,
                    isFinished: false
                }),

                navigate('/sideChoice')
            }

        } catch (error) {
            console.error("Erreur lors de la validation du round:", error);
            // Afficher une alerte ou une modale d'erreur ici si nécessaire
        }
    }


    const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const p = e.target.value;
        // Permet seulement les chiffres
        const numericValue = p.replace(/[^0-9]/g, ''); 
        const value = parseInt(numericValue);
        setRound({
            ...round,
            points: isNaN(value) ? 0 : value
        })
    }

    const getAllRoundsInGame = async () => {
        try {
            const response = await axios.get(`${baseAPIURL}/round/${game.id}`)
            console.log('getAllRoundsInGame', response.data.result);
            const initialStats = {
                totalKills: 0,
                totalAssists: 0,
                totalPoints: 0,
                totalDeaths: 0,
                totalRounds: 0,
                totalDisconnected: 0,
                playerScore: 0,
                opponentScore: 0
            };
            type AccProps = {
                totalKills: number; totalAssists: number; totalPoints: number; totalDeaths: number; totalRounds: number; totalDisconnected: number; playerScore: number; opponentScore: number
            }
            type RoundProps = { kills: number; assists: number; points: number; death: boolean; disconnected: number; roundResult: string, isFinished: boolean }

            const aggregatedStats = response.data.result.reduce((acc: AccProps, round: RoundProps) => {
                acc.totalKills += round.kills;
                acc.totalAssists += round.assists;
                acc.totalPoints += round.points;
                acc.totalDisconnected += round.disconnected;
                
                if (round.isFinished === true) {
                    if (round.roundResult === null) {
                        acc.playerScore += 0;
                        acc.opponentScore += 0;
                    }
                    else if (round.roundResult === 'Victory') {
                        acc.playerScore += 1;
                    } else if (round.roundResult === 'Defeat') {
                        acc.opponentScore += 1;
                    } else if (round.roundResult === 'Draw') {
                        acc.playerScore += 1;
                        acc.opponentScore += 1;
                    }
                }
                if (round.death === true) {
                    acc.totalDeaths += 1;
                }
                acc.totalRounds += 1;
                return acc;
            }, initialStats);
            console.log('aggregatedStats', aggregatedStats);

            setStatsForGame(aggregatedStats)

        } catch (error) {
            console.log(error);

        }
    }

    const fetchDatas = async () => {
        await getAllRoundsInGame()
    }
    useEffect(() => {
        fetchDatas()
    }, [game.id, round.roundNumber]) // Ajout des dépendances pour une meilleure pratique

    return (
        <div className="p-4 bg-white min-h-screen"> 
            <div className="w-full">
                <p className="text-center text-2xl font-bold mb-3" >Round {round.roundNumber}</p>

                <div className="flex items-center justify-center my-4"> 
                    <p className="text-xl flex space-x-2 items-center">
                        Score : <div className="font-semibold text-blue-600">Joueur {statsForGame.playerScore ?? 0}</div> - <div className="font-semibold text-red-600">Adversaire {statsForGame.opponentScore ?? 0}</div>
                    </p>
                </div>

            </div>


            <div className="mb-5 pb-3 border-b border-gray-300"> 
                <p className="text-base font-semibold mb-2">Résultat du Round</p>
                <div className="flex flex-wrap justify-between gap-2"> 
                    {statValuesResult.map(roundResult => (
                        <StatButton
                            key={roundResult}
                            title={roundResult}
                            value={roundResult}
                            stat="roundResult"
                            setRound={setRound}
                            round={round}
                        />
                    ))}
                </div>
            </div>

            <div className="mb-5 pb-3 border-b border-gray-300"> 
                <p className="text-base font-semibold mb-2">Kills</p>
                <div className="flex flex-wrap justify-between gap-2">
                    {statValues.map(value => (
                        <StatButton
                            key={`kill-${value}`}
                            title={String(value)}
                            value={value}
                            stat="kills"
                            setRound={setRound}
                            round={round}
                        />
                    ))}
                </div>
            </div>

            {/* Section ASSISTS */}
            <div className="mb-5 pb-3 border-b border-gray-300"> 
                <p className="text-base font-semibold mb-2">Assists</p>
                <div className="flex flex-wrap justify-between gap-2">
                    {statValues.map(value => (
                        <StatButton
                            key={`assist-${value}`}
                            title={String(value)}
                            value={value}
                            stat="assists"
                            setRound={setRound}
                            round={round}
                        />
                    ))}
                </div>
            </div>

            {/* Section MORT */}
            <div className="mb-5 pb-3 border-b border-gray-300"> 
                <p className="text-base font-semibold mb-2">Mort</p>
                <div className="flex flex-wrap justify-between gap-2">
                    <StatButton title="Oui" value={true} stat="death" setRound={setRound} round={round} />
                    <StatButton title="Non" value={false} stat="death" setRound={setRound} round={round} />
                </div>
            </div>

            {/* Section DÉCONNEXION */}
            <div className="mb-5 pb-3 border-b border-gray-300"> 
                <p className="text-base font-semibold mb-2">Déconnexion</p>
                <div className="flex flex-wrap justify-between gap-2">
                    <StatButton title="Oui" value={true} stat="disconnected" setRound={setRound} round={round} />
                    <StatButton title="Non" value={false} stat="disconnected" setRound={setRound} round={round} />
                </div>
            </div>

            {/* Section POINTS (input corrigé) */}
            <div className="flex items-center my-5 p-2 bg-gray-50 rounded-lg"> 
                <label htmlFor="points-input" className="text-base font-semibold mr-3">Points :</label>
                <input
                    id="points-input"
                    className="border border-gray-400 p-2 flex-1 mr-3 text-base rounded shadow-inner"
                    type="number" // Utilisation du type number pour une meilleure expérience mobile
                    placeholder="Entrez les points"
                    value={round.points !== undefined ? String(round.points) : ''}
                    onChange={handlePointChange} // Correction : onChange pour React Web/HTML
                />
                <p className="text-base">points</p>
            </div>

            {/* Affichage du récapitulatif conditionnel */}
            {
                round.roundNumber > 1 &&
                <div className="p-3 bg-gray-100 rounded-lg mt-4 text-sm space-y-1"> 
                    <div className="font-bold border-b pb-1 mb-1 border-gray-300">Récapitulatif de la partie :</div>
                    <div>Rounds joués : {Number(statsForGame?.totalRounds) - 1}</div>
                    <div>Kills : {statsForGame?.totalKills}</div>
                    <div>Assists : {statsForGame?.totalAssists}</div>
                    <div>Points : {statsForGame?.totalPoints}</div> 
                    <div>Mort : {statsForGame?.totalDeaths}</div>
                    <div>Déconnexion : {statsForGame?.totalDisconnected}</div>
                </div>
            }

            <div className="mt-5"> 
                <button 
                    className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-xl hover:bg-green-600 transition duration-200 shadow-xl"
                    onClick={() => validRound()}
                >
                    {game.overtime ? "Prolongations (Valider le Round)" : "Round suivant (Valider le Round)"}
                </button>
            </div>
        </div>
    )

}

// L'objet 'styles' n'est plus nécessaire car les classes Tailwind sont utilisées directement.

export default Round
