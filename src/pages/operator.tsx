import axios from "axios";

import { useGameContext } from "../contexts/gameContext.tsx";
import { useQuery, } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { OperatorType } from "../type/operator";

import '../styles/operator.scss'


const Operator = () => {
    const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL
    const { round, setRound } = useGameContext()
    const navigate = useNavigate()
 
    const user = {
        preferences: {
            image: false,
            icon: true
        }
    }

    const fetchOperatorsBySide = async () => {
        let roundSide = round.side
        if (!roundSide) {
            roundSide = localStorage.getItem('side')
        }
        try {
            const response = await axios.get(`${baseAPIURL}/operator/getAllOperatorsBySide/${roundSide}`, {
                withCredentials: true
            });
            if (Array.isArray(response.data)) {
                return response.data
            } else {
                throw new Error("Format de données invalide reçu de l'API.");
            }
        } catch (e) {
            console.error("Erreur de récupération des agents:", e);
        }
    }

    const {
        data: operatorsData,
        isLoading,

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
    const operatorChoosen = async (operator: OperatorType) => {
        // type ErrorType = {
        //     response: {
        //         data: {
        //             message: string
        //         }
        //     }
        // }
        try {
            const roundId = localStorage.getItem("roundId")
            
            
            const response = await axios.put(`${baseAPIURL}/round/update/${roundId}`, {
                round,
                operatorId: operator.id
            }, {
                withCredentials: true
            })
            console.log(response);

            if (response.status === 200) {
                setRound({
                    ...round,
                    operatorId: operator.id,
                    operator
                });
                navigate('/round')
            }
        } catch (error: unknown) {
            console.log(error);

            // if (
            //     typeof error === 'object' && error !== null &&
            //     'response' in error && typeof (error as any).response === 'object' && (error as any).response !== null &&
            //     'data' in (error as any).response && typeof (error as any).response.data === 'object' && (error as any).response.data !== null &&
            //     'message' in (error as any).response.data
            // ) {
            //     onError((error as ErrorType).response.data.message);
            // } else {

            //     onError("Une erreur inattendue est survenue.");
            // }
        }
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
                    operatorsData && operatorsData.map((operator: OperatorType) => {
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
