
import { useGameContext } from "../contexts/gameContext";
import axios from "axios";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";




// --- Types pour la réutilisation des boutons ---
type StatKey = 'kills' | 'assists' | 'death' | 'disconnected';

interface StatButtonProps {
    title: string;
    value: number | boolean;
    stat: StatKey;
    setRound: (newRound: any) => void;
    round: any; // Idéalement, utilisez le type de 'round' ici
}

/**
 * Composant réutilisable pour mettre à jour une stat spécifique (kills, assists, death, etc.).
 */
const StatButton = ({ title, value, stat, setRound, round }: StatButtonProps) => (
    <div style={styles.button_container}>
        <button
            title={title}
            // La couleur peut indiquer l'état sélectionné, par exemple
            color={round[stat] === value ? '#3498db' : '#2c3e50'}
            onClick={() => {
                setRound({
                    ...round,
                    [stat]: value // Utilisation d'une clé dynamique pour mettre à jour la stat
                });
            }}
        />
    </div>
);


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
    // const validRound = async () => {
    //     try {
    //         const response = await axios.put(`${baseAPIURL}/round/update/${round.id}`, {
    //             round,
    //             isFinished: true
    //         })
    //         console.log(response.data.gameStatus);

    //         if (response.data.gameStatus === 'PLAYER_WON') {
    //             Toast.show({
    //                 type: 'success',
    //                 text1: 'Victoire',

    //             })
    //             return
    //         }
    //         if (response.data.gameStatus === 'PLAYER_LOST') {
    //             Toast.show({
    //                 type: 'error',
    //                 text1: 'Défaite',

    //             })
    //             return
    //         }
    //         if (response.data.gameStatus === 'IN_PROGRESS') {
    //             setTimeout(() => {
    //                 Toast.show({
    //                     type: 'success',
    //                     text1: 'Round suivant',

    //                 })
    //             }, 1000);
    //             setRound({
    //                 id: '',
    //                 roundNumber: round.roundNumber + 1,
    //                 gameId: game.id,
    //                 sideId: "",
    //                 sideName: "",
    //                 winningSideId: "",
    //                 operatorId: "",
    //                 kills: 0,
    //                 death: false,
    //                 assists: 0,
    //                 disconnected: false,
    //                 points: 0,
    //                 isFinished: true

    //             }),

    //                 navigate('/sideChoice')
    //         }



    //     } catch (error) {
    //         console.log(error);

    //     }
    // }
    const navigate = useNavigate()
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

                // Toast.show({
                //     type: gameStatus === 'PLAYER_WON' ? 'success' : 'error',
                //     text1: gameStatus === 'PLAYER_WON' ? 'Victoire !' : (gameStatus === 'PLAYER_LOST' ? 'Défaite !' : 'Match Nul !'),
                //     text2: `Score final: ${finalScore}`,
                // });
                navigate('/endGame')

                return
            }

            if (gameStatus === 'IN_PROGRESS' || gameStatus === 'OVERTIME') {
                // setTimeout(() => {
                //     Toast.show({
                //         type: 'success',
                //         text1: gameStatus === 'OVERTIME' ? 'Prolongations !' : 'Round suivant',
                //     })
                // }, 100);


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
            // Toast.show({
            //     type: 'error',
            //     text1: 'Erreur',
            //     text2: "Échec de la validation du round.",
            // });
        }
    }


    const handlePointChange = (p: string) => {
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
                // acc.playerScore += round.roundResult === 'Victory' ? 1 : 0;
                // acc.opponentScore += round.roundResult === 'Defeat' ? 1 : 0;
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
    }, [])

    return (
        <>
            <div className="w-100">
                <p  className="text-center" >Round {round.roundNumber}</p>

                <div style={styles.score_container}>
                    <p style={styles.score_text}>
                        Score : <div>Joueur {statsForGame.playerScore ? Number(statsForGame.playerScore) : 0}</div> - <div>Adversaire {statsForGame.opponentScore ? Number(statsForGame.opponentScore) : 0}</div>
                    </p>
                </div>

            </div>


            <div style={styles.stat_group}>
                <p style={styles.stat_label}>Résultat du Round</p>
                <div style={styles.buttons_row}>
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

            <div style={styles.stat_group}>
                <p style={styles.stat_label}>Kills</p>
                <div style={styles.buttons_row}>
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
            <div style={styles.stat_group}>
                <p style={styles.stat_label}>Assists</p>
                <div style={styles.buttons_row}>
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
            <div style={styles.stat_group}>
                <p style={styles.stat_label}>Mort</p>
                <div style={styles.buttons_row}>
                    <StatButton title="Oui" value={true} stat="death" setRound={setRound} round={round} />
                    <StatButton title="Non" value={false} stat="death" setRound={setRound} round={round} />
                </div>
            </div>

            {/* Section DÉCONNEXION */}
            <div style={styles.stat_group}>
                <p style={styles.stat_label}>Déconnexion</p>
                <div style={styles.buttons_row}>
                    <StatButton title="Oui" value={true} stat="disconnected" setRound={setRound} round={round} />
                    <StatButton title="Non" value={false} stat="disconnected" setRound={setRound} round={round} />
                </div>
            </div>

            {/* Section POINTS (input corrigé) */}
            <div style={styles.points_input_container}>
                <input
                className="bgc-red"
                    placeholder="Points"

                    value={round.points !== undefined ? String(round.points) : ''}

                    onChangeText={handlePointChange}
                />
                <p style={styles.points_text}>points</p>
            </div>

            {/* Affichage du récapitulatif conditionnel */}
            {
                round.roundNumber > 1 &&
                <div style={styles.recap_container}>
                    <div>Récapitulatif de la partie :</div>
                    <div>Rounds joués : {Number(statsForGame?.totalRounds) - 1}</div>
                    <div>Kill : {statsForGame?.totalKills}</div>
                    <div>Assists : {statsForGame?.totalAssists}</div>
                    <div>divoints : {statsForGame?.totaldivoints}</div>
                    <div>Mort : {statsForGame?.totalDeaths}</div>
                    <div>Déconnexion : {statsForGame?.totalDisconnected}</div>

                </div>
            }

            <div style={styles.submit_button_container}>
                {game.overtime ?
                    <button title="Prolongations" onClick={() => validRound()} /> :
                    <button title="Round suivant" onClick={() => validRound()} />
                }

            </div>
        </ >
    )

}

const styles = ({
    main_container: {
        padding: 15,
        // Ajoutez des marges ou paddings globaux si nécessaire
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    score_container: {
        alignItems: 'center',
        marginVertical: 15,
    },
    score_text: {
        fontSize: 20,
    },
    stat_group: {
        marginBottom: 20,
        // Ajout d'une bordure ou d'un style pour séparer les groupes
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
    },
    stat_label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    buttons_row: {
        flexDirection: "row",
        justifyContent: 'space-between',
        // Utiliser wrap pour les longues listes de boutons
        flexWrap: 'wrap',
    },
    button_container: {
        // Pour donner un espace entre les petits boutons
        marginHorizontal: 4,
        flexGrow: 1, // Permet aux boutons de prendre plus de place
        minWidth: '10%', // S'assurer que les boutons sont utilisables
    },
    points_input_container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    text_input: {
        borderWidth: 1,
        borderColor: '#000',
        padding: 8,
        flex: 1, // Prend le maximum d'espace disponible
        marginRight: 10,
        fontSize: 16,
    },
    points_text: {
        fontSize: 16,
    },
    recap_container: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginTop: 15,
    },
    submit_button_container: {
        marginTop: 20,
    }
})


export default Round