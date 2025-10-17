import axios from "axios";

import { useGameContext } from "../contexts/gameContext";
import { useQuery, } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type Operator = {
    id: string;
    name: string;
    icon: string;
}

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
            const response = await axios.get(`${baseAPIURL}/operator/getAllOperatorsBySide/${roundSide}`);
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
                {/* <ActivityIndicator size="large" color="#0000ff" /> */}
                <p /* style={styles.statusText} */>Chargement des agents...</p>
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
        // style={styles.container}
        >
            <div>
             {/* @ts-ignore */}
                <p>Liste des agents ({operatorsData.length})
                </p>
            </div>
            <div style={{
                                    display: "flex",flexWrap:"wrap",
                                     width: "100%",
                                     justifyContent:"center"
                                    }}>
                {
                    operatorsData && operatorsData.map((operator: Operator) => {
                        return (
                            <div onClick={() => operatorChoosen(operator)} key={operator.id}
                                style={{
                                    border: "solid,1px, red", width: "100px",
                                    height: "100px" }}
                                        >
                                        {/* L'utilisatruer pourra choisir dans son profil si il préfére les icones ou les images */ }
                                {user.preferences.icon ?
                                    <img
                                        style={{
                                            width: "100px",
                                            height: "100px"
                                        }}
                                        key={operator.id}

                                        src={operator.icon}


                                    />
                                    :
                                    <img
                                        style={{
                                            width: "60px",
                                            height: "60px"
                                        }}
                                        key={operator.id}
                                        // @ts-ignore
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
/* 
const styles = ({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f8f9fa',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#343a40',
        textAlign: 'center',
    },

    operator_list: {

        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
    },
    operator: {
        width: 20,
        height: 20,
        marginTop: 16,
        paddingVertical: 8,
        borderWidth: 0,
        borderColor: '#8e8e8e',
        backgroundColor: 'red',
        alignItems: 'center',
        marginBottom: 10,
        overflow: "hidden"
    },
    operator__name: {
        paddingVertical: 8,
      
        color: '#20232a',
        textAlign: 'center',
        fontSize: 20, 
        fontWeight: 'bold',
    },
    operator__image: {
       
        width: 60,
        height: 60,
        marginVertical: 10,
        borderColor: '#8e8e8e',
        borderWidth: 1,
    },
    statusText: {
        marginTop: 10,
        fontSize: 16,
        color: '#6c757d',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        marginBottom: 10,
    }
});
 */

export default Operator
