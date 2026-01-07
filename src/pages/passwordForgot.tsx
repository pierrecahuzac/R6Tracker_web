import axios from "axios";
import { useState, type ChangeEvent } from "react";
import baseURL from "../functions/baseURL.tsx"

const PasswordForgot = () => {
    

    const [email, setEmail] = useState('')
    const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }
    const handleSubmit = async () => {
        try {
           await axios.post(`${baseURL}/player/forgotPassword`)
         
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