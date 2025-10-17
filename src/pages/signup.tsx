import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import '../styles/signup.scss'
// URL de base de votre API (récupérée de l'environnement Vite)
const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL;

const Signup = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    username: "",
    password: '',
    passwordConfirmation: "",
  });

  /**
   * Gestionnaire générique des changements de saisie.
   * Cette version garantit la compatibilité en accédant toujours à e.target.
   * @param {import('react').ChangeEvent<HTMLInputElement>} e - L'objet événement de changement.
   */
  const handleInputChange = (e:any) => {
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
   {/* @ts-ignore */}
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
      });
      
      console.log("Compte créé avec succès:", response.data);

    } catch (error) { 
       {/* @ts-ignore */}
      const errorMessage = error.response?.data?.message || "Erreur inconnue lors de l'inscription.";
      console.error("Erreur API:", errorMessage);
    }
  };

  return (
    <div 
     className="signup"
    >
      <p style={{ marginBottom: 12 }}>Créer mon compte</p>
      
      {/* Balise <form> pour garantir que la soumission se fait uniquement via le bouton submit */}
      <form 
        onSubmit={handleSubmitAccount} 
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
      
        {/* CHAMP EMAIL */}
        <input
          placeholder="Email"
          name="email" // CLÉ CRUCIALE: Doit correspondre à l'état
          value={credentials.email}
          onChange={handleInputChange} // Utilisation du gestionnaire générique
          autoCapitalize="none"
          type="email" 
          style={{
            width: 240,
            height: 44,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 6,
            paddingLeft: 10,
            marginBottom: 8,
          }}
        />
        
        {/* CHAMP NOM D'UTILISATEUR */}
        <input
          placeholder="Nom d'utilisateur"
          name="username" // CLÉ CRUCIALE: Doit correspondre à l'état
          value={credentials.username}
          onChange={handleInputChange}
          style={{
            width: 240,
            height: 44,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 6,
            paddingLeft: 10,
            marginBottom: 8,
          }}
        />
        
        {/* CHAMP MOT DE PASSE */}
        <input
          placeholder="Mot de passe"
          name="password" // CLÉ CRUCIALE: Doit correspondre à l'état
          value={credentials.password}
          onChange={handleInputChange}
          type="password"
          style={{
            width: 240,
            height: 44,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 6,
            paddingLeft: 10,
            marginBottom: 12,
          }}
        />
        
        {/* CHAMP CONFIRMATION MOT DE PASSE */}
        <input
          placeholder="Confimation du mot de passe"
          name="passwordConfirmation" // CLÉ CRUCIALE: Doit correspondre à l'état
          value={credentials.passwordConfirmation}
          onChange={handleInputChange}
          type="password"
          style={{
            width: 240,
            height: 44,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 6,
            paddingLeft: 10,
            marginBottom: 12,
          }}
        />
        
        {/* BOUTON de soumission */}
        <div style={{ width: 240, marginBottom: 16 }}>
          <button type="submit" className="button">
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