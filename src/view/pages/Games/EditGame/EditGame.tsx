import { FC, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { RootState } from "../../../../redux/store";
import { gameAPI } from "../../../../redux/services/GameApi";
import { Game } from "../../../../redux/models/Interfaces";
import Loader from "../../../components/Common/LoadingSpinner/Loader";
import { setCard } from "../../../../redux/slices/GlobalStates";
import "./EditGame.scss";
import AlertMessage from "../../../components/Common/AlertMessage/AlertMessage";

const EditGameHebrew = {
  EditGame: "עריכת משחק",
  Name: "שם המשחק:",
  Description: "תיאור:",
  Save: "שמירה",
  ViewUnits: "עריכת חוליות",
  NoUnits: "עדיין אין חוליות",
};

interface LocationState {
  updatedGame?: Game;
}

const EditGame: FC = () => {
  const game = useSelector(
    (state: RootState) => state.globalStates.selectedCard
  ) as Game;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;

  const [gameName, setGameName] = useState(game.gameName);
  const [gameDescription, setGameDescription] = useState(
    game.description || ""
  );

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const units = useSelector(
    (state: RootState) => state.globalStates.unitsInEditGame
  );
  console.log(units);
  useEffect(() => {
    clearLocalStorage();
  }, [locationState, dispatch, game.units]);

  const clearLocalStorage = () => {
    localStorage.removeItem("addUnitName");
    localStorage.removeItem("addUnitDescription");
    localStorage.removeItem("addUnitHint");
    localStorage.removeItem("selectedTask");
    localStorage.removeItem("selectedLocation");
    localStorage.removeItem("selectedObject");
    localStorage.removeItem("gameName");
    localStorage.removeItem("gameDesc");
    localStorage.removeItem("units");
  };

  const handleEditUnits = () => {
    dispatch(
      setCard({
        ...game,
        gameName,
        description: gameDescription,
        units,
      })
    );
    navigate("/EditGameUnitsPage", {
      state: {
        game: {
          ...game,
          gameName,
          description: gameDescription,
          units,
        },
      },
    });
  };

  const normalizeUnits = (units: any[]): any[] => {
    return units.map((unit, index) => ({
      unitID: unit.unitID,
      name: unit.name,
      description: unit.description || "",
      hint: unit.hint,
      unitOrder: index,
      objectID: unit.objectDTO ? unit.objectDTO.objectID : unit.objectID,
      taskID: unit.taskDTO ? unit.taskDTO.taskID : unit.taskID,
      locationID: unit.locationDTO
        ? unit.locationDTO.locationID
        : unit.locationID,
    }));
  };

  const handleSubmit = async () => {
    if (gameName && !gameName.trim()) {
      setAlertMessage("שם המשחק לא יכול להיות ריק");
      return;
    }
    setIsLoading(true);
    setLoadingMessage("מעדכן משחק...");
    try {
      const updatedGameData: Partial<Game> = {
        ...game,
        gameName,
        description: gameDescription,
      };
      // console.log("updateGame units:", units);
      const normalizedUnits = normalizeUnits(units);
      // console.log("normalizedUnits:", normalizedUnits);
      const response = await gameAPI.updateGame(updatedGameData, normalizedUnits);
      if (response.status === 200) {
        const updatedGame: Game = {
          ...game,
          gameName,
          description: gameDescription,
          units: units,
        };
        dispatch(setCard(updatedGame));
        setAlertMessage("משחק עודכן בהצלחה");
        navigate("/Games");
      } else {
        throw new Error("Failed to update game");
      }
    } catch (error) {
      console.error("Failed to update game:", error);
      setAlertMessage("עדכון משחק נכשל");
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <div className="edit-game-EditGame" dir="rtl">
      <Loader isLoading={isLoading} message={loadingMessage} />
      {alertMessage && <AlertMessage message={alertMessage} />}
      <div className="overlay-EditGame" />
      <div className="game-form-container-EditGame">
        <h2 className="form-title-EditGame">{EditGameHebrew.EditGame}</h2>
        <div className="form-group-EditGame">
          <label className="form-label-EditGame">{EditGameHebrew.Name}</label>
          <div className="input-wrapper-EditGame">
            <input
              className="game-input-EditGame"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group-EditGame">
          <label className="form-label-EditGame">
            {EditGameHebrew.Description}
          </label>
          <div className="input-wrapper-EditGame">
            <textarea
              className="game-textarea-EditGame"
              value={gameDescription}
              onChange={(e) => setGameDescription(e.target.value)}
            />
          </div>
        </div>
        <button className="edit-units-EditGame" onClick={handleEditUnits}>
          {EditGameHebrew.ViewUnits}
        </button>
        <div className="form-buttons-EditGame">
          <button onClick={handleSubmit} className="update-button-EditGame">
            {EditGameHebrew.Save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGame;
