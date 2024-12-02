import { FC, useEffect, useState } from "react";
import TaskCard from "./TaskCard/TaskCard";
import "./TasksPage.scss";
import HomePage from "../../components/Common/HomePage/HomePage";
import { taskAPI } from "../../../redux/services/TaskApi";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "../../../redux/slices/saveAllData";
import { RootState } from "../../../redux/store";
import ConfirmationDialog from "../../components/Common/ConfirmationDialog/ConfirmationDialog";
import { Admin, Task, UserRole } from "../../../redux/models/Interfaces";
import {
  setCard,
  setIsCreateGame,
  setIsObjectsPage,
  setPage,
} from "../../../redux/slices/GlobalStates";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Common/LoadingSpinner/Loader";
import { buttonsName } from "../../../redux/models/Types";
import AlertMessage from "../../components/Common/AlertMessage/AlertMessage";

const TasksPage: FC = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.AllData.Tasks);
  const [showConfirm, setShowConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const adminStr = localStorage.getItem("admin");
  const currAdmin: Admin = adminStr
    ? {
        ...JSON.parse(adminStr),
        role: UserRole[JSON.parse(adminStr).role as keyof typeof UserRole],
      }
    : null;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(setIsCreateGame(false));
    const fetchTasks = async () => {
      setIsLoading(true);
      setLoadingMessage("טוען משימות...");
      try {
        const fetchedTasks = await taskAPI.getAllTasks();
        dispatch(setTasks(fetchedTasks));
        setLoadingMessage("");
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoadingMessage("שגיאה בטעינת משימות");
      } finally {
        setIsLoading(false);
      }
      dispatch(setIsObjectsPage(false));
      dispatch(setPage(buttonsName.Tasks));
    };
    fetchTasks();
  }, [dispatch, refetchTrigger]);

  const handleDelete = (task: Task) => {
    if (
      currAdmin.adminID !== task.adminIDAPI &&
      currAdmin.role !== UserRole.MainAdmin
    ) {
      setAlertMessage("אי אפשר למחוק משימה שלא שייכת למחלקה שלך");
    } else {
      setTaskToDelete(task);
      setShowConfirm(true);
    }
  };

  const handleDeleteConfirm = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    setLoadingMessage("מוחק משימה ...");
    if (taskToDelete) {
      try {
        const response = await taskAPI.deleteTask(taskToDelete.taskID);
        if (response.status === 200) {
          setRefetchTrigger((prev) => prev + 1);
          setLoadingMessage("המשימה נמחקה בהצלחה!");
        }
      } catch (error: any) {
        console.error("Error deleting task:", error);
        setAlertMessage("שגיאה במחיקת המשימה:\n" + (error || "Unknown error"));
        setLoadingMessage("שגיאה במחיקת המשימה");
      } finally {
        setIsLoading(false);
        setLoadingMessage("");
      }
    }
  };

  const handleEdit = (task: Task) => {
    if (
      currAdmin.adminID !== task.adminIDAPI &&
      currAdmin.role !== UserRole.MainAdmin
    ) {
      setAlertMessage("אי אפשר לערוך משימה שלא שייכת למחלקה שלך");
    } else {
      dispatch(setCard(task));
      navigate("/EditTask");
    }
  };

  const handleDuplicate = (task: Task) => {
    navigate("/DuplicateTask", { state: { taskToDuplicate: task } });
  };

  return (
    <div dir="rtl">
      <Loader isLoading={isLoading} message={loadingMessage} />
      {alertMessage && <AlertMessage message={alertMessage} />}
      <HomePage
        objects={tasks}
        page="Task"
        Component={(props) => (
          <TaskCard
            {...props}
            onShowConfirm={handleDelete}
            onEditTask={handleEdit}
            onDuplicateTask={handleDuplicate}
          />
        )}
        addButton="הוספת משימה חדשה"
        addButtonPath="addTask"
      />
      {showConfirm && (
        <ConfirmationDialog
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowConfirm(false)}
          message={`את/ה בטוח/ה שאת/ה רוצה למחוק המשימה "${taskToDelete?.name}"?`}
        />
      )}
    </div>
  );
};

export default TasksPage;
