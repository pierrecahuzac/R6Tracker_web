import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGameContext } from "../contexts/gameContext";
import axios from "axios";

const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL

const Signin = () => {
  const { player, setPlayer } = useGameContext();
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

      setPlayer(fullPlayerObject);
      console.log("Connexion réussie. Bienvenue:", fullPlayerObject.username);
      navigate('/');

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Erreur de connexion.";
      console.error("Erreur de connexion:", errorMessage);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        minHeight: '100vh',
      }}
    >
      <p style={{ marginBottom: 12 }}>Connexion</p>

      <form
        onSubmit={handleLogin}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >

        {/* CHAMP EMAIL */}
        <input
          placeholder="Email"
          name="email"
          value={login.email}
          onChange={handleInputChange}
          autoCapitalize="none"
          type="email"
          style={{
            width: 240,
            height: 44,

            border: '1px solid #ccc',
            borderRadius: 6,
            paddingLeft: 10,
            marginBottom: 8,
          }}
        />

        {/* CHAMP MOT DE PASSE */}
        <input
          placeholder="Mot de passe"
          name="password"
          value={login.password}
          onChange={handleInputChange}
          type="password"
          style={{
            width: 240,
            height: 44,

            border: '1px solid #ccc',
            borderRadius: 6,
            paddingLeft: 10,
            marginBottom: 12,
          }}
        />

        {/* BOUTON de soumission */}
        <div style={{ width: 240, marginBottom: 16 }}>
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            Se connecter
          </button>
        </div>
      </form>

     
        <>
          <Link to="/signup" style={{ marginBottom: '8px' }}>Créer un compte?
          </Link>
          <Link to="/forgotPassword">Mot de passe oublié?
          </Link></>


    </div>
  );
}



export default Signin;