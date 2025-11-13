export interface PlayerData {
    id: string;
    username: string;
    email: string;
    isLoggedIn: boolean;
    language: "Fr" | "En" | string; 
    activeGameId: string | null; 
}