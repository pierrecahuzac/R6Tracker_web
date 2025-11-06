import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGameContext } from "../contexts/gameContext";
import api from "../functions/apiClient";
import axios from "axios";
import useToast from "../hooks/useToast";



import '../styles/signin.scss';


const Signin = () => {
  const {  setPlayer } = useGameContext();
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    email: '',
    password: ''
  });
  const {
    onError,
  } = useToast()

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
      const response = await api.post('/player/login', {
        email: login.email,
        password: login.password,
      });
      console.log(response);
      
      const playerFromResponse = response.data.player || response.data;

      const fullPlayerObject = {
        id: playerFromResponse.playerId,
        username: playerFromResponse.username,
        email: playerFromResponse.email,
        isLoggedIn: true,
        language: 'Fr',
      };
      setPlayer(fullPlayerObject);
      console.log("Connexion réussie. Bienvenue:", fullPlayerObject.username);
      navigate('/');

    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? (error.response?.data as any)?.message || 'Erreur de connexion.'
        : 'Erreur de connexion.';
      onError(errorMessage)

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


        <input
          data-aos="fade-right"
          data-aos-delay="200"
          className="input__email"
          placeholder="Email"
          name="email"
          value={login.email}
          onChange={handleInputChange}
          autoCapitalize="none"
          type="email"

        />

   
        <input
          data-aos="fade-right"
          data-aos-delay="100"
          className="input__password"
          placeholder="Mot de passe"
          name="password"
          value={login.password}
          onChange={handleInputChange}
          type="password"

        />

   

        <button type="submit" className="button__submit" data-aos="fade-right" data-aos-delay="50">
          Se connecter
        </button>


      </form>

      <>
        <Link to="/signup" className="link__signup">Créer un compte?
        </Link>
        <Link to="/password-forgot" className="link__signin">Mot de passe oublié?
        </Link></>


    </div>
  );
}



export default Signin;