import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useGameContext } from "../contexts/gameContext.tsx";

import StatButton from "../ui/statButton";
import useToast from "../hooks/useToast";

import '../styles/round.scss'
import ReturnButton from "../ui/returnButton.tsx";

const Round = () => {
    const { round, setRound, game, setGame } = useGameContext()
    const { onError } = useToast()
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

    const validRound = async () => {
        try {
            if(round.roundResult === null){
                onError("Impossible de valider le round sans un résultat valable")
                return
            }
            const roundId = localStorage.getItem("roundId")
            if (round.roundNumber === 0) {
                setRound({
                    ...round,
                    roundNumber: localStorage.getItem('roundNumber')
                })
            }
            const response = await axios.put(`${baseAPIURL}/round/update/${roundId}`, {
                round,
                isFinished: true
            }, {
                withCredentials: true
            })
            const { gameStatus } = response.data;

            if (gameStatus === 'PLAYER_WON' || gameStatus === 'PLAYER_LOST' || gameStatus === 'MATCH_DRAW') {
                navigate('/end-game')
                return
            }

            if (gameStatus === 'IN_PROGRESS' || gameStatus === 'OVERTIME') {
                // on vient mettre à jour game dans le contexte après chaque fin de round
                const fetchGame = await axios.get(`${baseAPIURL}/game/${game.id}`, {
                    withCredentials: true
                })
                console.log(fetchGame.data.gameById);
               setGame(fetchGame.data.gameById)
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
                    isFinished: false,
                    result: "",
                }),

                    navigate('/sideChoice')
            }
        } catch (error) {
            //@ts-ignore
            console.log(error);
            //@ts-ignore
            // onError(`Erreur lors de la validation du round: ${error.response.data.message}`)
        }
    }

    const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputPoints = e.target.value;
        const numericValue = Number(inputPoints);
        setRound({
            ...round,
            points: isNaN(numericValue) ? 0 : numericValue
        })
    }

    const getAllRoundsInGame = async () => {
        let gameId = game.id;
        if (!gameId) {
            gameId = localStorage.getItem("gameId")
        }
        try {
            const response = await axios.get(`${baseAPIURL}/round/${gameId}`, {
                withCredentials: true
            })

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
            setStatsForGame(aggregatedStats)
        } catch (error) {
            onError(`Erreur lors de la récupération des rounds: ${error}`)
        }
    }

    const fetchDatas = async () => {
        await getAllRoundsInGame()
    }
    useEffect(() => {
        fetchDatas()
    }, [game.id, round.roundNumber])


    return (
        <div className="round">
            <ReturnButton />
            <div className="round__container">
                <div className="round__stats">
                    <h1 className="" >Manche {round.roundNumber === 0 ? localStorage.getItem('roundNumber') : round.roundNumber}</h1>
                    <div className='round__game-stats'>
                        Score : <span className="">Joueur {game.playerScore ?? 0}</span> - <span className="">Adversaire {game.opponentScore ?? 0}</span>
                    </div>
                </div>
                <div className="round__side">
                    {/* <h4 className="">Résultat du Round</h4> */}
                    <div className="buttons__list">
                        {statValuesResult.map(roundResult => (
                            <StatButton
                                key={roundResult}
                                title={roundResult}
                                value={roundResult}
                                stat="roundResult"
                                setRound={setRound}
                                round={round}
                                className="button__result"
                            />
                        ))}
                    </div>
                </div>
                <div className="buttons__kills">
                    <h4 className="">Joueurs tués</h4>
                    <div className="buttons__list">
                        {statValues.map(value => (
                            <StatButton
                                key={`kill-${value}`}
                                title={String(value)}
                                value={value}
                                stat="kills"
                                setRound={setRound}
                                round={round}
                                className="round__kills"
                            />
                        ))}
                    </div>
                </div>
                {/* Section ASSISTS */}
                <div className="buttons__assists">
                    <h4 className="">Assistances</h4>
                    <div className="buttons__list">
                        {statValues.map(value => (
                            <StatButton
                                key={`assist-${value}`}
                                title={String(value)}
                                value={value}
                                stat="assists"
                                setRound={setRound}
                                round={round}
                                className="round__assists"
                            />
                        ))}
                    </div>
                </div>
                {/* Section MORT */}
                <div >
                    <h4 className="">Mort ?</h4>
                    <div className="buttons__list">
                        <StatButton title="Oui" className="round__death" value={true} stat="death" setRound={setRound} round={round} />
                        <StatButton title="Non" className="round__death" value={false} stat="death" setRound={setRound} round={round} />
                    </div>
                </div>
                {/* Section DÉCONNEXION */}
                <div >
                    <h4 className="">Déconnexion ?</h4>
                    <div className="buttons__list">
                        <StatButton title="Oui" value={true} className="round__disconnected" stat="disconnected" setRound={setRound} round={round} />
                        <StatButton title="Non" value={false} className="round__disconnected" stat="disconnected" setRound={setRound} round={round} />
                    </div>
                </div>
                {/* Section POINTS (input corrigé) */}
                <div className="round__points">
                    <h4 >Points totalisés</h4>

                    <input
                        className="round__input-points"
                        id="points-input"

                        type="number"
                        placeholder="Entrez les points"
                        value={round.points !== undefined ? String(round.points) : ''}
                        onChange={handlePointChange}
                    />
                </div>

                {/* Affichage du récapitulatif conditionnel */}
                {
                    round.roundNumber > 1 &&
                    <div className="">
                        <div className="">Récapitulatif de la partie :</div>
                        <div>Rounds joués : {Number(statsForGame?.totalRounds) - 1}</div>
                        <div>Kills : {statsForGame?.totalKills}</div>
                        <div>Assists : {statsForGame?.totalAssists}</div>
                        <div>Points : {statsForGame?.totalPoints}</div>
                        <div>Mort : {statsForGame?.totalDeaths}</div>
                        <div>Déconnexion : {statsForGame?.totalDisconnected}</div>
                    </div>
                }

                <div className="">
                    <button
                        className="button__valid-round"
                        onClick={() => validRound()}
                    >
                        {game.overtime ? "Prolongations" : "Round suivant "}
                    </button>
                </div>
            </div>
        </div>

    )

}


export default Round
