import { useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";

import { createNewGame } from "../functions/newGame";
import { logout } from "../functions/playerFunctions.tsx";
import { useGameContext } from "../contexts/gameContext.tsx";
import useToast from "../hooks/useToast";

import Logo from "/r6tracker.png";
import "../styles/home.scss";


const Home = () => {
  const { player, setPlayer, setGame } = useGameContext();
 
  
  const { onSuccess } = useToast();

    useEffect(() => {
    if (player.username) {
      onSuccess(`Bienvenu ${player.username}!`);
    }
  }, [player.username, onSuccess]);
  const navigate = useNavigate();
  const handleLogoutPlayer = async () => {
    try {
      await logout(setPlayer, navigate);
      localStorage.clear();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="home">
      <div className="home__container">
        <div className="home__logo">
          <img src={Logo} alt="r6 tracker logo" className="home__logo-img" />
        </div>

        {player.id ? (
          <div className="home__buttons">
            <div className="home__links">
              <Link to={`/player/${player.id}`} className="button__new-game">
                {player.username}
              </Link>
              <Link to={`/stats/${player.id}`} className="button__player-stats">
                Statistiques
              </Link>
              <button
                onClick={() => createNewGame(player, setGame, navigate)}
                className="button__new-game"
              >
                {player.language === "Fr" ? "Nouvelle partie" : "New game"}
              </button>             

              <button className="button__logout" onClick={handleLogoutPlayer}>
                {player.language === "Fr" ? "Déconnexion" : "Logout"}
              </button>
            </div>
          </div>
        ) : (
          <div className="home__links">
            <Link to={`/signin`} className="home__signin">
              Connexion
            </Link>
            <Link to={`/signup`} className="home__signup">
              Créer un compte
            </Link>
          </div>
        )}
        {player.isLoggedIn && (
          <div className="home__language-choice">
            <button
              className="home__language-fr"
              onClick={() =>
                setPlayer({
                  ...player,
                  language: "Fr",
                })
              }
            >
              Fr
            </button>
            <button
              className="home__language-en"
              onClick={() =>
                setPlayer({
                  ...player,
                  language: "En",
                })
              }
            >
              En
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
