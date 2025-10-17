import type { StatButtonProps } from "../type/statButton";

const StatButton = ({ title, value, stat, setRound, round }: StatButtonProps) => {

    const isSelected = round[stat] === value;
    const baseClasses = "button__result";
    const selectedClasses = "button__selected";
    const defaultClasses = "button__result-default";

    return (
        
            <button
                className={`${baseClasses} ${isSelected ? selectedClasses : defaultClasses}`}
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