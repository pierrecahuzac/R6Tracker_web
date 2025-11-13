import { Link } from "react-router"

import '../styles/return-button.scss'

const ReturnButton = () => {
    return (
        <Link to='/' className="return-button" >Accueil</Link>
    )
}

export default ReturnButton