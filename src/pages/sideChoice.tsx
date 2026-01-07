import { useGameContext } from "../contexts/gameContext.tsx";
import axios from "axios";

import { useNavigate } from "react-router-dom";

import "../styles/side-choice.scss";
import ReturnButton from "../ui/returnButton.tsx";
import baseURL from "../functions/baseURL.tsx";

const SideChoice = () => {
  const { round, setRound, player, game } = useGameContext();

  const navigate = useNavigate();
  const chooseSide = async (sideChoosen: "ATTACK" | "DEFENSE") => {
    setRound({
      ...round,
      roundNumber: round.roundNumber + 1,
      side: sideChoosen,
    });
    let gameId = localStorage.getItem("gameId");
    // let gameId = game.game.id;

    if (!gameId) {
      gameId = localStorage.getItem("gameId");
    }
    try {
      const response = await axios.post(
        `${baseURL}/round/create`,
        {
          sideChoosen,
          playerId: player.id,
          gameId: gameId,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);

      if (response.status === 201) {
        localStorage.setItem("roundId", response.data.id);
        setRound({
          ...round,
          ...response.data,
          side: sideChoosen,
        });

        localStorage.setItem("side", sideChoosen);
        localStorage.setItem("roundNumber", response.data.roundNumber);
        const updateRound = await axios.put(
          `${baseURL}/game/update/${gameId}`,
          {
            roundNumber: round.roundNumber + 1,
          },
          {
            withCredentials: true,
          }
        );
        console.log(updateRound);
        
        navigate("/operator");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ReturnButton />

      <div className="side-choice">
        <h1 className="side-choice__title">Round: {round.roundNumber + 1}</h1>
        <div className="side-choice__buttons">
          <button
            className="side-choice__button-side"
            onClick={() => chooseSide("ATTACK")}
          >
            Attaque
          </button>
          <button
            className="side-choice__button-side"
            onClick={() => chooseSide("DEFENSE")}
          >
            Défense
          </button>
        </div>
      </div>
    </>
  );
};

export default SideChoice;
