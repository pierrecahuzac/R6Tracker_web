
import { Link, useNavigate } from "react-router-dom";

// import axios from "axios";
//import { logout } from "../functions/player";
import { createNewGame } from "../functions/newGame";
// import { useQuery } from "@tanstack/react-query";
import { useGameContext } from "../contexts/gameContext";

import Logo from "/r6tracker.png";
import '../styles/home.scss'
//import Toast from 'react-native-toast-message';



const Home = () => {    
    const { player, /* setPlayer */ setGame } = useGameContext();


    // const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL

    // const fetchGames = async () => {
    //     try {
    //         const response = await axios.get(`${baseAPIURL}/game/findAll`);
    //         return response.data;
    //     } catch (error) {
    //         console.log(error);

    //     }
    // }
    // const { data: games, isLoading, error } = useQuery({
    //     queryKey: ['games'],
    //     queryFn: fetchGames,
    //     enabled: player.isLoggedIn
    // })

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
            className='home'
        >
            <div className="home__container">
                <div className="home__logo"><img src={Logo} alt="r6 tracker logo"
                    className="home__logo-img" /></div>
                {/* <div>
                <div>
                    <p>Liste des parties en cours</p>
                    {isLoading && <p>Chargement...</p>}
                    {error && <p>Erreur de chargement</p>}

                </div>{games && games.map((game: { id: string }) => (
                    <p key={game.id}>{game.id}</p>
                ))}</div> */}

                {player.id ? <div className="home__buttons">
                    <div className="home__links" >
                        <button onClick={() => createNewGame(player, setGame, navigate)} className="button__new-game">Nouvelle partie</button> <button className="button__new-game">Déconnexion</button>
                    </div>

                </div> :
                    <div className="home__links" >
                        <Link to={`/signin`} className="home__signin">Connexion</Link>

                        <Link to={`/signup`} className="home__signup">Créer un compte</Link>
                    </div>}
            </div>
        </div>

    );
};

export default Home;
