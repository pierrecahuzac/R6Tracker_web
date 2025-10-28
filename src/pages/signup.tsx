import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import '../styles/signup.scss'
import useToast from "../hooks/useToast";
// URL de base de votre API (récupérée de l'environnement Vite)
const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL;

const Signup = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    username: "",
    password: '',
    passwordConfirmation: "",
  });
  const { onSuccess } = useToast()
  const navigate = useNavigate();
  const {
    onError,
  } = useToast()
  /**
   * Gestionnaire générique des changements de saisie.
   * Cette version garantit la compatibilité en accédant toujours à e.target.
   * @param {import('react').ChangeEvent<HTMLInputElement>} e - L'objet événement de changement.
   */
  const handleInputChange = (e: any) => {
    // CORRECTION/OPTIMISATION : On assure que l'on extrait le 'name' et le 'value' de l'input
    const { name, value } = e.target;

    // Mise à jour de l'état avec la propriété dynamique [name]
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Gestionnaire de la soumission du formulaire
   * @param {import('react').FormEvent} e - Événement de formulaire
   */
  {/* @ts-ignore */ }
  const handleSubmitAccount = async (e) => {
    // Empêche le rechargement de la page par défaut (correction pour éviter les fetch involontaires)
    e.preventDefault();

    // Vérifications...
    if (credentials.password !== credentials.passwordConfirmation) {
      console.error("Erreur: Les mots de passe ne correspondent pas.");
      return;
    }

    if (!credentials.email || !credentials.password || !credentials.username) {
      console.error("Champs requis: Veuillez renseigner tous les champs.");
      return;
    }

    try {
      const response = await axios.post(`${baseAPIURL}/player/signup`, {
        email: credentials.email,
        password: credentials.password,
        username: credentials.username
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })      
           
     
      if (response.status === 201) {
        onSuccess('Compte crée avec succès');
        setTimeout(() => {
          navigate('/signin')
        }, 2000)
      }  
    } catch (error) {
      //@ts-ignore
      const errorMessage = error.response?.data?.message || "Erreur inconnue lors de l'inscription.";
      console.error("Erreur API:", errorMessage);
      onError(errorMessage)      
    }
  };

  return (
    <div
      className="signup"
    >
      <h1 style={{ marginBottom: 12 }}>Créer mon compte</h1>


      <form
        onSubmit={handleSubmitAccount}

      >


        <input
        data-aos="fade-right"
          data-aos-delay="100"
          className="input__email"
          placeholder="Email"
          name="email" // CLÉ CRUCIALE: Doit correspondre à l'état
          value={credentials.email}
          onChange={handleInputChange} // Utilisation du gestionnaire générique
          autoCapitalize="none"
          type="email"
        />
        <input
        data-aos="fade-right"
          data-aos-delay="150"
          className="input__username"
          placeholder="Nom d'utilisateur"
          name="username" // CLÉ CRUCIALE: Doit correspondre à l'état
          value={credentials.username}
          onChange={handleInputChange}
        />
        <input
        data-aos="fade-right"
          data-aos-delay="200"
          className="input__password"
          placeholder="Mot de passe"
          name="password" // CLÉ CRUCIALE: Doit correspondre à l'état
          value={credentials.password}
          onChange={handleInputChange}
          type="password"
        />
        <input
        data-aos="fade-right"
          data-aos-delay="250"
          className="input__password"
          placeholder="Confimation du mot de passe"
          name="passwordConfirmation" // CLÉ CRUCIALE: Doit correspondre à l'état
          value={credentials.passwordConfirmation}
          onChange={handleInputChange}
          type="password"
        />
        {/* BOUTON de soumission */}
        <div style={{ width: 240, marginBottom: 16 }}>
          <button type="submit" className="button__submit"
          data-aos="fade-right"
          data-aos-delay="300">
            Créer mon compte
          </button>
        </div>
      </form>
      <Link to="/signin">J'ai un compte</Link>
      {/* <Toast /> */}
    </div>
  );
}



export default Signup;