
import { Link, useNavigate } from "react-router-dom";


//import { logout } from "../functions/player";
import { createNewGame } from "../functions/newGame";

import { useGameContext } from "../contexts/gameContext";

import Logo from "/r6tracker.png";
import { useEffect } from "react";
import useToast from "../hooks/useToast";
// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";



import '../styles/home.scss'
import { logout } from "../functions/player";

const Home = () => {
    const { player, setPlayer, setGame } = useGameContext();
    const { onSuccess } = useToast()

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

    useEffect(() => {
        if (player.username) {
            onSuccess(`Bienvenu ${player.username}!`)
        }
    }, [])

    const navigate = useNavigate()
    const handleLogoutPlayer = () => {
        try {
            logout(player, setPlayer, navigate)
        } catch (error) {
            console.log(error);

        }
    }
    return (
        <div
            className='home'
        >
            <div className="home__container">
                <div className="home__logo"><img src={Logo} alt="r6 tracker logo"
                    className="home__logo-img" />
                </div>
                {/* <div>
                    <div>
                        <p style={{ textAlign: "center" }}>Liste des parties en cours</p>
                        {isLoading && <p>Chargement...</p>}
                        {error && <p>Erreur de chargement</p>}

                    </div>{games && games.map((game: { id: string }) => (
                        <p key={game.id}>{game.id}</p>
                    ))}
                </div> */}

                {player.id ? <div className="home__buttons">
                    <div className="home__links" >
                        <Link to={`/player/${player.id}`} className="button__new-game">{player.username}</Link>
                        <Link to={`/stats/${player.id}`} className="button__new-game">Statistiques</Link>
                        <button onClick={() => createNewGame(player, setGame, navigate)} className="button__new-game">{player.language === "Fr" ? "Nouvelle partie" : "New game"}</button>
                        <button className="button__new-game" onClick={handleLogoutPlayer}>{player.language === "Fr" ? "Déconnexion" : "Logout"}</button>
                    </div>

                </div> :
                    <div className="home__links" >
                        <Link to={`/signin`} className="home__signin">Connexion</Link>
                        <Link to={`/signup`} className="home__signup">Créer un compte</Link>
                    </div>}
                {player.isLoggedIn && <div className="home__language-choice">
                    <button className="home__language-fr" onClick={() =>
                        setPlayer({
                            ...player,
                            language: "Fr"
                        })}>Fr</button>
                    <button className="home__language-en" onClick={() =>
                        setPlayer({
                            ...player,
                            language: "En"
                        })}>En</button>
                </div>}

            </div>
        </div>

    );
};

export default Home;
