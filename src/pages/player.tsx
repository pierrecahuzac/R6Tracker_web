import { useState, type FormEvent } from "react";
import { useGameContext } from "../contexts/gameContext";

const Player = () => {
    // Récupération des données du joueur
    const { player } = useGameContext();
    
    // États pour l'interface utilisateur
    const [changePassword, setChangePassword] = useState(false);
    
    // États pour le formulaire de changement de mot de passe
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");

    const submitNewPassword = (event : FormEvent<HTMLFormElement>) => {
        
        event.preventDefault(); 
        
        // Validation basique (à compléter avec une logique plus robuste)
        if (newPassword !== newPasswordConfirmation) {
            console.error("Les nouveaux mots de passe ne correspondent pas.");
            return;
        }

        console.log("Tentative de changement de mot de passe...");
        console.log("Mot de passe actuel:", password);
        console.log("Nouveau mot de passe:", newPassword);
        
     
        setPassword("");
        setNewPassword("");
        setNewPasswordConfirmation("");
        setChangePassword(false); 
    }

    return (
        <div className="player">
            <div className="player__container">
                <span className="player__id">Joueur #{player.id}</span>
            </div>
            <p className="player__username">{player.username}</p>
            <p className="player__email">{player.email}</p>

            <button 
                className="player__button player__button--change-password"
                onClick={() => setChangePassword(!changePassword)}>
                Changer de mot de passe
            </button>
            
            {changePassword &&
                <form 
                    className="player__form player__form--change-password"
                    onSubmit={submitNewPassword}
                >
                    <input 
                        className="player__input"
                        type="password" 
                        value={password} 
                        name="password" 
                        placeholder="Mot de passe actuel" 
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input 
                        className="player__input"
                        type="password" 
                        name="newPassword" 
                        value={newPassword} 
                        placeholder="Nouveau mot de passe" 
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <input 
                        className="player__input"
                        type="password" 
                        name="newPasswordConfirmation" 
                        value={newPasswordConfirmation} 
                        placeholder="Confirmation du nouveau mot de passe" 
                        onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                        required
                    />
                    <button 
                        className="player__button player__button--submit"
                        type="submit">
                        Valider
                    </button>
                </form>
            }
        </div>
    )
}

export default Player;