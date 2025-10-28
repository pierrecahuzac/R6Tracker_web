import axios from "axios";

const baseAPIURL = import.meta.env.VITE_PUBLIC_BASE_API_URL
export const logout = async (
    //@ts-ignore
    player,
    //@ts-ignore
    setPlayer,
    //@ts-ignore
    navigate
) => {
    try {
        const { NODE_ENV } = import.meta.env;

        if (NODE_ENV === "production") {
            const response = await axios.post(`${baseAPIURL}/player/logout`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                setPlayer({
                    id: "",
                    username: "",
                    email: "",
                })
                navigate('/')
            }
            return 
        }
        const response = await axios.get(`${baseAPIURL}/player/logout`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            setPlayer({
                id: "",
                username: "",
                email: "",
            })
            navigate('/')
        }


    } catch (e) {
        console.log(e);
    }
};

export const fetchUser = async (setPlayer: any) => {
    try {
        const response = await axios.get(`${baseAPIURL}/auth/me`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200 && response.data.message === "player connected") {
            //@ts-ignore
            setPlayer({
                id: response.data.playerId,
                username: response.data.username,
                isLoggedIn: true,
            })
            return
        }

    } catch (error) {
        //@ts-ignore
        setPlayer({ id: null, username: null, isLoggedIn: false });
        throw error;


    }
}

