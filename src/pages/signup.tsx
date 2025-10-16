import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

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
  const handleInputChange = (e) => {
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
      const errorMessage = error.response?.data?.message || "Erreur inconnue lors de l'inscription.";
      console.error("Erreur API:", errorMessage);
    }
  };

  return (
    <div 
      style={{
        display: 'flex', // Remplacé flex: 1 par display: flex pour un contexte web
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        minHeight: '100vh', // Ajout pour centrer sur toute la hauteur
      }}
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
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            Créer mon compte
          </button> 
        </div>

      </form>
      
      <Link to="/signin">J'ai un compte</Link>
      
      {/* <Toast /> */}
    </div>
  );
}

// L'objet styles n'est pas utilisé tel quel mais est conservé par convention
const styles = ({
  container: {
    backgroundColor: 'red'
  }
});

export default Signup;