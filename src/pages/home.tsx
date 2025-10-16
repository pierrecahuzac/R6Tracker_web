
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { logout } from "../functions/player";
import { createNewGame } from "../functions/newGame";
import { useQuery } from "@tanstack/react-query";
import { useGameContext } from "../contexts/gameContext";

//import Toast from 'react-native-toast-message';



const Home = () => {
    const { player, setPlayer, setGame } = useGameContext();


    const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL

    const fetchGames = async () => {
        try {
            const response = await axios.get(`${baseAPIURL}/game/findAll`);
            return response.data;
        } catch (error) {
            console.log(error);

        }
    }
    const { data: games, isLoading, error } = useQuery({
        queryKey: ['games'],
        queryFn: fetchGames,
        enabled: player.isLoggedIn
    })

    //   useEffect(() => {


    //     if(player.username) {
    //       setTimeout(() => {
    //       Toast.show({
    //         type: 'success',
    //         text1: `Bienvenu ${player.username}!`, 
    //         autoHide:true,
    //         visibilityTime: 1000,
    //       })
    //     }, 1000)
    //     }

    //   }, [])
const navigate = useNavigate()
    return (

        <div
            className='w-100'
        >
            {player && player.isLoggedIn === true ? (
                <div style={{ alignItems: "center" }}>
                    <Link to={`/player/${player.id}`} style={{ marginBottom: 20 }}>
                        Bienvenue, {player.username}
                    </Link>

                    <Link
                        to={{ pathname: `/player/${player.id}`, }}
                        style={{ marginBottom: 4 }}
                    >
                        Profil
                    </Link>
                    <Link to={{
                        pathname: ` /stats/${player.id}`,
                        
                    }} style={{ marginBottom: 20 }}>
                        Stats
                    </Link>
                    <div>
                        <p>Liste des parties en cours</p>
                        {isLoading && <p>Chargement...</p>}
                        {error && <p>Erreur de chargement</p>}
                        {games && games.map((game: { id: string }) => (
                            <p key={game.id}>{game.id}</p>
                        ))}
                    </div>
                    <button title="Déconnexion" color="#841584" onClick={() => logout(setPlayer)} />

                    <button title="Nouvelle partie" onClick={() => createNewGame(player, setGame, navigate)} />
                    {/* <Link to={`/newGame`} style={{ marginTop: 20 }}>Nouvelle partie</Link> */}
                </div>
            ) : (
                <Link to={`/signin`}>Connexion</Link>
            )}
            
        </div>

    );
};

export default Home;
