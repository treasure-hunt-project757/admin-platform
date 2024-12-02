import { FC, useState, useCallback } from "react";
import { debounce } from "lodash";
import {
  HospitalIcon,
  ApplicationsIcon,
  LocationIcon,
  TaskIcon,
  LogOutIcon,
  WhiteLogo,
  Model,
} from "../../../photos";
import "./AdminMenu.scss";
import { buttonsName } from "../../../../redux/models/Types";
import { Link } from "react-router-dom";
import {
  setIsObjectsPage,
  setPage,
} from "../../../../redux/slices/GlobalStates";
import { useDispatch } from "react-redux";
import { Admin, UserRole } from "../../../../redux/models/Interfaces";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import { trainModelApi } from "../../../../redux/services/TrainModelApi";
import AlertMessage from "../AlertMessage/AlertMessage";

interface AdminMenuProps {
  setActiveButton: (buttonName: string) => void;
  activeButton: string;
}

const AdminMenu: FC<AdminMenuProps> = ({ setActiveButton, activeButton }) => {
  const dispatch = useDispatch();
  const adminStr = localStorage.getItem("admin");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const currAdmin: Admin = adminStr
    ? {
      ...JSON.parse(adminStr),
      role: UserRole[JSON.parse(adminStr).role as keyof typeof UserRole],
    }
    : null;
  const [showConfirm, setShowConfirm] = useState(false);

  // Create a debounced function for page change
  const debouncedSetPage = useCallback(
    debounce((page: string) => {
      dispatch(setPage(page));
      setActiveButton(page);
      dispatch(setIsObjectsPage(false));
      localStorage.setItem("page", page);
    }, 200),
    [dispatch, setActiveButton]
  );

  const handlePageChange = (page: string) => {
    if (activeButton !== page) {
      debouncedSetPage(page);
    }
  };
  const handleTrainModel = async () => {
    setShowConfirm(false);
    try {
      setAlertMessage("התחיל אימון מודל");
      await trainModelApi.retrainModel();
      setAlertMessage("אימון מודל הסתיים בהצלחה");
    } catch (error) {
      console.error("Failed to retrain model:", error);
      setAlertMessage("שגיאה באימון מודל");
    }
  };

  return (
    <div className="admin-menu">
      {alertMessage && <AlertMessage message={alertMessage} />}
      {showConfirm && (
        <ConfirmationDialog
          onConfirm={handleTrainModel}
          onCancel={() => setShowConfirm(false)}
          message={
            "האם ברצונך לאמן המודל?" +
            "\n" +
            "אימון המודל יקח כמה דקות, נא לא ללחוץ שוב על הכפתור למנוע שמירת מודלים זהים"
          }
        />
      )}
      <div className="title"> חפש את המטמון ב </div>
      <img className="logo" src={WhiteLogo} alt="logo" />
      <div className="buttons">
        <Link className="menu-button" to="/Sectors">
          <button
            className={`menu-button ${activeButton === buttonsName.Sectors ? "active" : ""
              }`}
            onClick={() => handlePageChange(buttonsName.Sectors)}
          >
            <div className="button-txt">{buttonsName.Sectors}</div>
            <img
              className="navbar-icon-sectors"
              src={HospitalIcon}
              alt="menu-icon"
            />
          </button>
        </Link>
        <Link className="menu-button" to="/Games">
          <button
            className={`menu-button ${activeButton === buttonsName.Games ? "active" : ""
              }`}
            onClick={() => handlePageChange(buttonsName.Games)}
          >
            <div className="button-txt">{buttonsName.Games}</div>
            <img
              className="navbar-icon"
              src={ApplicationsIcon}
              alt="menu-icon"
            />
          </button>
        </Link>
        <Link className="menu-button" to="/Locations">
          <button
            className={`menu-button ${activeButton === buttonsName.Locations ? "active" : ""
              }`}
            onClick={() => handlePageChange(buttonsName.Locations)}
          >
            <div className="button-txt">{buttonsName.Locations}</div>
            <img className="navbar-icon" src={LocationIcon} alt="menu-icon" />
          </button>
        </Link>
        <Link className="menu-button" to="/Tasks">
          <button
            className={`menu-button ${activeButton === buttonsName.Tasks ? "active" : ""
              }`}
            onClick={() => handlePageChange(buttonsName.Tasks)}
          >
            <div className="button-txt">{buttonsName.Tasks}</div>
            <img className="navbar-icon" src={TaskIcon} alt="menu-icon" />
          </button>
        </Link>
        <div>
          <button
            className={`menu-button ${activeButton === buttonsName.TrainModel ? "active" : ""
              }`}
            onClick={() => {
              if (currAdmin?.role !== UserRole.MainAdmin) {
                setAlertMessage("אין לך הרשאות להשתמש במודל");
              } else {
                setShowConfirm(true);
                handlePageChange(buttonsName.TrainModel);
              }
            }}
          >
            <div className="button-txt">{buttonsName.TrainModel}</div>
            <img className="navbar-icon" src={Model} alt="menu-icon" />
          </button>
        </div>
        <Link className="menu-button" to="/">
          <button
            className={`menu-button ${activeButton === buttonsName.Logout ? "active" : ""
              }`}
            onClick={() => {
              localStorage.clear();
              handlePageChange(buttonsName.Logout);
            }}
          >
            <div className="button-txt">{buttonsName.Logout}</div>
            <img className="navbar-icon" src={LogOutIcon} alt="menu-icon" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AdminMenu;
