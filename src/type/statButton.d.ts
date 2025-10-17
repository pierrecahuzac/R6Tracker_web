export interface StatButtonProps {
    title: string;
    value: number | boolean | string;
    stat: StatKey;
    setRound: (newRound: any) => void;
    className: string
    round: any; 
}


type StatKey = 'kills' | 'assists' | 'death' | 'disconnected' | 'roundResult';

