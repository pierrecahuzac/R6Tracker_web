
import { Link, useNavigate } from "react-router-dom";

// import axios from "axios";
import { logout } from "../functions/player";
import { createNewGame } from "../functions/newGame";
// import { useQuery } from "@tanstack/react-query";
import { useGameContext } from "../contexts/gameContext";


import '../styles/home.scss'
//import Toast from 'react-native-toast-message';



const Home = () => {
    const { player, setPlayer, setGame } = useGameContext();


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

            <header style={{
                position: "fixed", width: '100%', height: "60px", backgroundColor: "#1d1f21", color: "white", top: 0, left: 0
            }}>
                <nav style={{ width: "100%", height: "60px", display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                    {player && player.isLoggedIn === true ? (
                        <div

                            style={{ width: "100%", height: "60px", display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                            <Link to={`/player/${player.id}`}>
                                Bienvenue, {player.username}
                            </Link>

                            <Link to={{
                                pathname: ` /stats/${player.id}`,

                            }}>
                                Statistiques du joueur
                            </Link>

                            <div className="home__buttons">
                                <button onClick={() => logout(setPlayer)} className="button__logout"  >Déconnexion</button>
                            </div>
                            {/* <Link to={`/newGame`} style={{ marginTop: 20 }}>Nouvelle partie</Link> */}
                        </div>
                    ) : (
                        <div className="home__login-signup">
                            <Link to={`/signin`} className="home__signin">Connexion</Link>
                            <Link to={`/signup`} className="home__signup">Créer un compte</Link>
                        </div>
                    )}
                </nav>
            </header>
            {/* <div>
                <div>
                    <p>Liste des parties en cours</p>
                    {isLoading && <p>Chargement...</p>}
                    {error && <p>Erreur de chargement</p>}

                </div>{games && games.map((game: { id: string }) => (
                    <p key={game.id}>{game.id}</p>
                ))}</div> */}

            <div className="home__buttons">


                <button onClick={() => createNewGame(player, setGame, navigate)} className="button__new-game">Nouvelle partie</button>
            </div>

        </div>

    );
};

export default Home;
