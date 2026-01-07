import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import useToast from "../hooks/useToast";
import baseURL from "../functions/baseURL.tsx"
import '../styles/signup.scss';



const Signup = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    username: "",
    password: '',
    passwordConfirmation: "",
  });
  
  // Ajout d'un état de chargement pour l'UX
  const [isLoading, setIsLoading] = useState(false);

  const { onSuccess, onError } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Validations de base
    if (!credentials.email || !credentials.password || !credentials.username) {
      onError("Veuillez renseigner tous les champs.");
      return;
    }

    if (credentials.password !== credentials.passwordConfirmation) {
      onError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);

    
    try {
 
      const response = await axios.post(`${baseURL}/player/signup`, {
        email: credentials.email,
        password: credentials.password,
        username: credentials.username
      });

      if (response.status === 201) {
        onSuccess('Compte créé avec succès');
        // Redirection après un court délai
        setTimeout(() => navigate('/signin'), 2000);
      }
    } catch (error) {
      // 3. Gestion fine des erreurs Axios
      let message = "Une erreur est survenue lors de l'inscription.";
      
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      
      console.error("Erreur API:", error);
      onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup">
      <h1 style={{ marginBottom: 12 }}>Créer mon compte</h1>

      <form onSubmit={handleSubmitAccount}>
        <input
          data-aos="fade-right"
          data-aos-delay="100"
          className="input__email"
          placeholder="Email"
          name="email"
          value={credentials.email}
          onChange={handleInputChange}
          autoCapitalize="none"
          type="email"
          disabled={isLoading}
        />
        <input
          data-aos="fade-right"
          data-aos-delay="150"
          className="input__username"
          placeholder="Nom d'utilisateur"
          name="username"
          value={credentials.username}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <input
          data-aos="fade-right"
          data-aos-delay="200"
          className="input__password"
          placeholder="Mot de passe"
          name="password"
          value={credentials.password}
          onChange={handleInputChange}
          type="password"
          disabled={isLoading}
        />
        <input
          data-aos="fade-right"
          data-aos-delay="250"
          className="input__password"
          placeholder="Confirmation du mot de passe"
          name="passwordConfirmation"
          value={credentials.passwordConfirmation}
          onChange={handleInputChange}
          type="password"
          disabled={isLoading}
        />

        <div style={{ width: 240, marginBottom: 16 }}>
          <button 
            type="submit" 
            className="button__submit"
            data-aos="fade-right"
            data-aos-delay="300"
            disabled={isLoading}
          >
            {isLoading ? "Chargement..." : "Créer mon compte"}
          </button>
        </div>
      </form>
      
      <Link to="/signin" className={isLoading ? "disabled-link" : ""}>
        J'ai un compte
      </Link>
    </div>
  );
}

export default Signup;