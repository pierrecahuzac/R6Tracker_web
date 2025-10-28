import axios from "axios";

import { useGameContext } from "../contexts/gameContext";
import { useQuery, } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type Operator = {
    id: string;
    name: string;
    icon?: string;
    image?: string;
}

import '../styles/operator.scss'

const Operator = () => {
    const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL
    const { round, setRound } = useGameContext()
    const navigate = useNavigate()
    // @ts-ignore
    const roundSide = round.side

    console.log(roundSide);

    const user = {
        preferences: {
            image: false,
            icon: true
        }
    }

    const fetchOperatorsBySide = async () => {
        try {
            const response = await axios.get(`${baseAPIURL}/operator/getAllOperatorsBySide/${roundSide}`, {
                withCredentials:true});
            console.log(response.data);
            if (Array.isArray(response.data)) {


                return response.data
            } else {
                throw new Error("Format de données invalide reçu de l'API.");
            }
        } catch (e) {
            console.error("Erreur de récupération des agents:", e);
            //       Alert.alert("Erreur de connexion", "Vérifiez la connexion au serveur API.");
        }
    }

    const {
        data: operatorsData,
        isLoading,
        //error
    } = useQuery({
        queryKey: ['operators'],
        queryFn: fetchOperatorsBySide
    })


    if (isLoading) {
        return (
            <div>
                <p >Chargement des agents...</p>
            </div>
        );
    }

    const operatorChoosen = (operator: Operator) => {
        setRound({
            ...round,
            operatorId: operator.id,

            // @ts-ignore
            operator
        });
        navigate('/round')
    }


    return (
        <div
            className="operator"
        >
            <div>
                <h1>Liste des agents ({operatorsData && operatorsData.length})
                </h1>
            </div>
            <div className="operator__list">
                {
                    operatorsData && operatorsData.map((operator: Operator) => {
                        return (
                            <div onClick={() => operatorChoosen(operator)} key={operator.id}

                            >

                                {user.preferences.icon ?
                                    <img
                                        className="operator__icon"

                                        key={operator.id}

                                        src={operator.icon}


                                    />
                                    :
                                    <img
                                        className="operator__image"
                                        key={operator.id}

                                        src={operator.image}
                                    />
                                }
                            </div>
                        )
                    }
                    )
                }
            </div>
        </div >
    )
}

export default Operator
