import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGameContext } from "../contexts/gameContext";
import axios from "axios";


const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL

import '../styles/signin.scss';

const Signin = () => {
  const {  setPlayer } = useGameContext();
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!login.password || !login.email) {
      console.error("Veuillez renseigner tous les champs.");
      return;
    }

    try {
      const response = await axios.post(`${baseAPIURL}/player/login`, {
        email: login.email,
        password: login.password,
      });
      console.log(response);

      const playerFromResponse = response.data.player || response.data;
      console.log(playerFromResponse);

      const fullPlayerObject = {
        id: playerFromResponse.id,
        username: playerFromResponse.username,
        email: playerFromResponse.email,
        isLoggedIn: true,
      };
// @ts-ignore
      setPlayer(fullPlayerObject);
      console.log("Connexion réussie. Bienvenue:", fullPlayerObject.username);
      navigate('/');

    } catch (error)
     {
      // @ts-ignore
      const errorMessage = error.response?.data?.message || "Erreur de connexion.";
      console.error("Erreur de connexion:", errorMessage);
    }
  };

  return (
    <div
      className='signin'
    >
      <h1 className=''>Connexion</h1>

      <form
        onSubmit={handleLogin}

      >

        {/* CHAMP EMAIL */}
        <input
          placeholder="Email"
          name="email"
          value={login.email}
          onChange={handleInputChange}
          autoCapitalize="none"
          type="email"

        />

        {/* CHAMP MOT DE PASSE */}
        <input
          placeholder="Mot de passe"
          name="password"
          value={login.password}
          onChange={handleInputChange}
          type="password"

        />

        {/* BOUTON de soumission */}

        <button type="submit" className="button" >
          Se connecter
        </button>

      </form>


      <>
        <Link to="/signup" >Créer un compte?
        </Link>
        <Link to="/forgotPassword">Mot de passe oublié?
        </Link></>


    </div>
  );
}



export default Signin;