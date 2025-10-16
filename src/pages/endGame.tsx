import { useNavigate } from "react-router-dom";


const EndGame = () => {
    //const params = useLocalSearchParams();
  //  const { status, score } = params;

    // const statusText = (status: string) => {
    //     if (status === 'PLAYER_WON') {
    //         return 'Victoire'
    //     }
    //     else if (status === 'PLAYER_LOST') {
    //         return 'Défaite'
    //     }
    //     if (status === 'MATCH_DRAW') {
    //         return 'Match Nul'

    //     }
    // }
    const navigate = useNavigate();
    return (
        <div>

            <p>Partie Terminée :</p>
            <p>Score : </p>
            <button title=" partie" onClick={() =>
                navigate('./newGame')} >Nouvelle partie </button>

        </div>

    )

}

export default EndGame;