import { useEffect, useState } from "react";
import "./AddGame.scss";
import { useNavigate } from "react-router-dom";
import { GameTBC, Unit } from "../../../../redux/models/Interfaces";
import { useLocation } from "react-router-dom";
import { gameAPI } from "../../../../redux/services/GameApi";
import Loader from "../../../components/Common/LoadingSpinner/Loader";
import ConfirmationDialog from "../../../components/Common/ConfirmationDialog/ConfirmationDialog";
import AlertMessage from "../../../components/Common/AlertMessage/AlertMessage";

const AddNewGameHeb = {
  CreateNewGame: "הוספת משחק חדש ",
  Name: "שם : ",
  Description: "תיאור : ",
  AddUnits: "הוספת חוליות",
  Save: "שמירה",
  Cancel: "ביטול",
  MandatoryUnits: "חובה להוסיף לפחות חוליה אחת לפני שמירת המשחק",
};

function AddGame() {
  const [gameName, setGameName] = useState(
    localStorage.getItem("gameName") || ""
  );
  const [gameDesc, setGameDesc] = useState(
    localStorage.getItem("gameDesc") || ""
  );
  const [gameUnits, setGameUnits] = useState<Unit[]>([]);
  const [gameImage] = useState<File | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    const units = location.state?.units || [];
    setGameUnits(units);

    const storedGameName = localStorage.getItem("gameName");
    const storedGameDesc = localStorage.getItem("gameDesc");
    if (storedGameName) setGameName(storedGameName);
    if (storedGameDesc) setGameDesc(storedGameDesc);
  }, [location.state?.units]);

  useEffect(() => {
    localStorage.setItem("gameName", gameName);
    localStorage.setItem("gameDesc", gameDesc);
  }, [gameName, gameDesc]);

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if (e.target.files && e.target.files[0]) {
  //         setGameImage(e.target.files[0]);
  //     }
  // };

  function clearLocalStorage() {
    localStorage.removeItem("addUnitName");
    localStorage.removeItem("addUnitDescription");
    localStorage.removeItem("addUnitHint");
    localStorage.removeItem("selectedTask");
    localStorage.removeItem("selectedLocation");
    localStorage.removeItem("selectedObject");
    localStorage.removeItem("gameName");
    localStorage.removeItem("gameDesc");
    localStorage.removeItem("units");
  }

  const handleSave = async () => {
    if (!gameName || !gameName.trim()) {
      setAlertMessage("חייב להיות שם למשחק");
    } else if (gameUnits.length === 0) {
      setAlertMessage("יש להוסיף לפחות חוליה אחת לפני שמירת המשחק");
    } else {
      const game: GameTBC = { gameName: gameName, description: gameDesc };
      const updatedGameUnits = gameUnits.map((unit) => ({
        ...unit,
        unitID: -1,
      }));
      setIsLoading(true);
      setLoadingMessage("שומר משחק ...");
      try {
        const response = await gameAPI.createGame(
          game,
          gameImage,
          updatedGameUnits
        );
        if (response.status === 200) {
          localStorage.removeItem("gameName");
          localStorage.removeItem("gameDesc");
          localStorage.removeItem("units");
          // navigate('/Games');
          setLoadingMessage("משחק נשמר בהצלחה!");
          setTimeout(() => {
            setIsLoading(false);
            setLoadingMessage("");
            navigate("/Games");
          }, 1000);
        } else {
          console.error("Failed to create game. Status code:", response.status);
          setLoadingMessage("שגיאה בשמירת משחק");
          setTimeout(() => {
            setIsLoading(false);
            setLoadingMessage("");
          }, 2000);
        }
      } catch (error) {
        console.error("Error creating game:", error);
        setLoadingMessage("שגיאה בשמירת משחק");
        setTimeout(() => {
          setIsLoading(false);
          setLoadingMessage("");
        }, 2000);
      }
    }
  };

  return (
    <div className="main-container-add-game">
      <Loader isLoading={isLoading} message={loadingMessage} />
      {alertMessage && <AlertMessage message={alertMessage} />}

      {showConfirm && (
        <ConfirmationDialog
          onConfirm={() => {
            setShowConfirm(false);
            navigate("/Games");
            clearLocalStorage();
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <div className="overlay" />
      <div className="add-game-container" dir="rtl">
        <div className="add-game-title">{AddNewGameHeb.CreateNewGame}</div>
        <div className="input-group">
          <label className="input-label">{AddNewGameHeb.Name}</label>
          <input
            type="text"
            className="game-input"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label className="input-label">{AddNewGameHeb.Description}</label>
          <textarea
            className="game-textarea"
            value={gameDesc}
            onChange={(e) => setGameDesc(e.target.value)}
          ></textarea>
        </div>
        {/* <div className='input-group'>
                    <label className='input-label'>Upload Image</label>
                    <input type='file' className='game-input' onChange={handleImageChange} />
                </div> */}
        <div className="input-group">
          <button
            className="add-buttons"
            onClick={() => {
              navigate("/UnitsPage");
            }}
          >
            {AddNewGameHeb.AddUnits}
          </button>
          <div className="mandatory-units-message">
            {AddNewGameHeb.MandatoryUnits}
          </div>
        </div>
        <div className="buttons">
          <button className="save-button" onClick={handleSave}>
            {AddNewGameHeb.Save}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => setShowConfirm(true)}
          >
            {AddNewGameHeb.Cancel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddGame;
