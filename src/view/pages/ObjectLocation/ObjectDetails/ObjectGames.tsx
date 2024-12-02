import React, { useState } from "react";
import Loader from "../../../components/Common/LoadingSpinner/Loader";
import AlertMessage from "../../../components/Common/AlertMessage/AlertMessage";
import HomePage from "../../../components/Common/HomePage/HomePage";
import GameCard from "../../Games/GameCard/GameCard";
import ConfirmationDialog from "../../../components/Common/ConfirmationDialog/ConfirmationDialog";
import { useDispatch } from "react-redux";
import { Admin, Game, UserRole } from "../../../../redux/models/Interfaces";
import { useNavigate, useLocation } from "react-router-dom";
import { gameAPI } from "../../../../redux/services/GameApi";
import { setGames } from "../../../../redux/slices/saveAllData";
import { setCard } from "../../../../redux/slices/GlobalStates";

const ObjectGames: React.FC = () => {
  const dispatch = useDispatch();
  const [showConfirm, setShowConfirm] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Use a fallback in case games are undefined
  const games = location.state?.games || [];

  const adminStr = localStorage.getItem("admin");
  const currAdmin: Admin = adminStr
    ? {
        ...JSON.parse(adminStr),
        role: UserRole[JSON.parse(adminStr).role as keyof typeof UserRole],
      }
    : null;

  const handleDelete = (game: Game) => {
    if (
      currAdmin?.adminID !== game.adminID &&
      currAdmin?.role !== UserRole.MainAdmin
    ) {
      setAlertMessage("אי אפשר למחוק משחק שלא שייך למחלקה שלך");
    } else {
      setGameToDelete(game);
      setShowConfirm(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (gameToDelete && gameToDelete.gameID) {
      setShowConfirm(false);
      setIsLoading(true);
      setLoadingMessage("מוחק משחק ...");
      try {
        const response = await gameAPI.deleteGame(gameToDelete.gameID);

        if (response.status === 200) {
          const message = gameToDelete.gameName + " משחק נמחק בהצלחה ";
          setAlertMessage(message);
          dispatch(
            setGames(
              games.filter(
                (obj: { gameID: number | undefined }) =>
                  obj.gameID !== gameToDelete.gameID
              )
            )
          );
          setLoadingMessage("משחק נמחק בהצלחה!");
          setTimeout(() => {
            setIsLoading(false);
            setLoadingMessage("");
          }, 500);
        }
      } catch (error) {
        setAlertMessage("שגיאה במחיקת המשחק:\n" + error);
        setTimeout(() => {
          setIsLoading(false);
          setLoadingMessage("");
        }, 2000);
      }
    } else {
      setAlertMessage("שגיאה במחיקת המשחק");
    }
  };

  const handleEdit = (game: Game) => {
    dispatch(setCard(game));
    navigate("/EditGame");
  };

  return (
    <div dir="rtl">
      <Loader isLoading={isLoading} message={loadingMessage} />
      {alertMessage && <AlertMessage message={alertMessage} />}

      <HomePage
        objects={games}
        page="Game"
        Component={(props) => (
          <GameCard
            {...props}
            onShowConfirm={handleDelete}
            onEditGame={handleEdit}
          />
        )}
      />

      {showConfirm && (
        <ConfirmationDialog
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowConfirm(false)}
          message={`את/ה בטוח/ה שאת/ה רוצה למחוק את המשחק "${gameToDelete?.gameName}"?`}
        />
      )}
    </div>
  );
};

export default ObjectGames;
