import axios from "axios";
import { useState, type ChangeEvent } from "react";


const PasswordForgot = () => {
    const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL;

    const [email, setEmail] = useState('')
    const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }
    const handleSubmit = async (e : any) => {
        try {
            const response = await axios.post(`${baseAPIURL}/player/forgotPassword`)
            console.log(response);
        } catch (error) {
            throw error
        }
    }
    return (
        <div>
            <h1>Mot de passe oublié</h1>
            <form action={handleSubmit}>
                <input type="text" placeholder="Email" name="email" value={email} onChange={handleEmail} />
            </form>
        </div>
    )

}

export default PasswordForgot;