
import { useGameContext } from "../contexts/gameContext"
import axios from "axios"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";

import '../styles/side-choice.scss'
const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL;

const SideChoice = () => {
    const { round, setRound, player, game } = useGameContext()
    const navigate = useNavigate()
    const chooseSide = async (sideChoosen: 'ATTACK' | 'DEFENSE') => {
        setRound({
            ...round,
            // @ts-ignore
            side: sideChoosen
        });

        try {
            const response = await axios.post(`${baseAPIURL}/round/create`, {
                sideChoosen,
                playerId: player.id,
                gameId: game.id
            })

            if (response.status === 201) {
                setRound({
                    ...round,
                    ...response.data,
                    side: sideChoosen
                })


                await axios.put(`${baseAPIURL}/game/update/${game.id}`, {
                    roundNumber: round.roundNumber + 1,

                })

                navigate('/operator')
            }
        } catch (error) {
            console.log(error);
        }
    }
    const getAllRoundInGame = () => {
        const response = axios.get(`${baseAPIURL}/round/${game.id}`)
        console.log(response);
    }

    const fetchRoundsData = async () => {
        getAllRoundInGame()
    }
    useEffect(() => {
        fetchRoundsData()

    }, [])
    return (
        <div className="side-choice">
            <h1 className="side-choice__title">Round: {round.roundNumber}</h1>
            <div className="side-choice__buttons">
                <button className="side-choice__button-side" onClick={() => chooseSide('ATTACK')} >Attaque</button>
                <button className="side-choice__button-side" onClick={() => chooseSide('DEFENSE')} >Défense</button>
            </div>
        </div>
    )
}

export default SideChoice
