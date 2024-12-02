import { FC, useEffect, useState } from "react";
import GameCard from "./GameCard/GameCard";
import "./GamesPage.scss";
import HomePage from "../../components/Common/HomePage/HomePage";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  setGames,
  setLocations,
  setTasks,
} from "../../../redux/slices/saveAllData";
import { gameAPI } from "../../../redux/services/GameApi";
import {
  setCard,
  setIsAddUnitPageFlag,
  setIsEditing,
  setIsEditUnitPage,
  setIsObjectsPage,
  setPage,
} from "../../../redux/slices/GlobalStates";
import { buttonsName } from "../../../redux/models/Types";
import { Admin, Game, UserRole } from "../../../redux/models/Interfaces";
import ConfirmationDialog from "../../components/Common/ConfirmationDialog/ConfirmationDialog";
import Loader from "../../components/Common/LoadingSpinner/Loader";
import { useNavigate } from "react-router-dom";
import { locationAPI } from "../../../redux/services/LocationApi";
import { taskAPI } from "../../../redux/services/TaskApi";
import AlertMessage from "../../components/Common/AlertMessage/AlertMessage";

const GamesPage: FC = () => {
  const dispatch = useDispatch();
  const games = useSelector((state: RootState) => state.AllData.Games);
  // const page = useSelector((state: RootState) => state.globalStates.page);
  const [showConfirm, setShowConfirm] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
  const adminStr = localStorage.getItem("admin");
  const currAdmin: Admin = adminStr
    ? {
        ...JSON.parse(adminStr),
        role: UserRole[JSON.parse(adminStr).role as keyof typeof UserRole],
      }
    : null;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Automatically refetch when the page is loaded
  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      setLoadingMessage("טוען משחקים...");
      dispatch(setIsEditing(false));
      dispatch(setIsEditUnitPage(false));
      dispatch(setIsAddUnitPageFlag(false));
      dispatch(setIsObjectsPage(false));
      dispatch(setPage(buttonsName.Games));
      try {
        const gamesData = await gameAPI.getAllGames();
        const locationsData = await locationAPI.getAllLocations();
        const tasksData = await taskAPI.getAllTasks();
        console.log("gamesData :", gamesData);
        dispatch(setGames(gamesData));
        dispatch(setLocations(locationsData));
        dispatch(setTasks(tasksData));
      } catch (error) {
        console.error("Error fetching data:", error);
        setAlertMessage("שגיאה בטעינת משחקים");
      } finally {
        setIsLoading(false);
        setLoadingMessage("");
      }
    };
    fetchGames();
  }, [dispatch, refetchTrigger]);

  const handleDelete = (game: Game) => {
    if (
      currAdmin.adminID !== game.adminID &&
      currAdmin.role !== UserRole.MainAdmin
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
            setGames(games.filter((obj) => obj.gameID !== gameToDelete.gameID))
          );
          setLoadingMessage("משחק נמחק בהצלחה!");
          setTimeout(() => {
            setRefetchTrigger((prev) => prev + 1); // Trigger refetch after delete
            setIsLoading(false);
            setLoadingMessage("");
          }, 500);
        }
      } catch (error: any) {
        dispatch(setGames(games));
        setAlertMessage("שגיאה במחיקת המשחק:\n" + error);
        setLoadingMessage("שגיאה במחיקת המשחק:\n" + error);
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
        addButton="הוספת משחק חדש"
        addButtonPath="AddGame"
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

export default GamesPage;
