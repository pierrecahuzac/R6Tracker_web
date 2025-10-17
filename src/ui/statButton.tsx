import type { StatButtonProps } from "../type/statButton";

const StatButton = ({ title, value, stat, setRound, round }: StatButtonProps) => {


    const isSelected = round[stat] === value;
    

    const typeClass = `button__${typeof value}`;

    const statusClass = isSelected ? "button__selected" : "button__unselected";

    return (
        <button
           
            className={`${statusClass} ${typeClass}`}
            
            onClick={() => {
               
                setRound({
                    ...round,
                    [stat]: value
                });
            }}
        >
            {title}
        </button>
    );
};
export default StatButton;