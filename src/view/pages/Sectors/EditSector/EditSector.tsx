import { FC, useState, useEffect } from "react";
import { DoctorUserIcon, PasswordIcon } from "../../../photos";
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../../../redux/services/AdminApi";
import "./EditSector.scss";
import { Admin } from "../../../../redux/models/Interfaces";
import Loader from "../../../components/Common/LoadingSpinner/Loader";
import AlertMessage from "../../../components/Common/AlertMessage/AlertMessage";

const EditSector: FC = () => {
  const sector = useSelector(
    (state: RootState) => state.globalStates.selectedCard
  ) as Admin;
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [username, setUsername] = useState(sector.username);
  const [sectorName, setSectorName] = useState(sector.sector);
  const [password, setPassword] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  useEffect(() => {
    setUsername(sector.username);
    setSectorName(sector.sector);
  }, [sector]);

  const isFormValid = (): boolean => {
    return username.trim() !== "" && sectorName.trim() !== "";
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setAlertMessage("שם משתמש ותפקיד לא יכולים להיות ריקים");
      return;
    }
    setIsLoading(true);
    setLoadingMessage("מעדכן אדמין...");
    try {
      const updatedAdmin: Admin = {
        ...sector,
        username,
        sector: sectorName,
      };
      await adminAPI.updateSectorAdmin(
        sector.adminID,
        updatedAdmin,
        passwordChanged ? password : undefined
      );
      setAlertMessage("אדמין עודכן בהצלחה");
      navigate("/Sectors");
    } catch (error: any) {
      console.error("Failed to create sector admin:", error.response.data);
      if (
        error.response.data.includes("Admin with this sector already exists.")
      ) {
        setAlertMessage("מחלקה כבר קיימת במערכת");
      } else {
        setAlertMessage("עדכון אדמין נכשל");
      }
      setLoadingMessage("שגיאה בעדכון אדמין");
      setTimeout(() => {
        setIsLoading(false);
        setLoadingMessage("");
      }, 2000);
    }
  };

  return (
    <div className="edit-sector" dir="rtl">
      <Loader isLoading={isLoading} message={loadingMessage} />
      {alertMessage && <AlertMessage message={alertMessage} />}
      <div className="overlay" />
      <div className="sector-form-container">
        <h2 className="form-title">עריכת מגזר</h2>
        <div className="form-group">
          <label className="form-label">שם משתמש</label>
          <div className="input-wrapper">
            <input
              className="sector-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <img className="input-icon" src={DoctorUserIcon} alt="User Icon" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">תפקיד</label>
          <div className="input-wrapper">
            <input
              className="sector-input"
              value={sectorName}
              onChange={(e) => setSectorName(e.target.value)}
            />
            <img className="input-icon" src={DoctorUserIcon} alt="User Icon" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">סיסמה</label>
          <div className="input-wrapper">
            <input
              className="sector-input"
              type="password"
              placeholder="השאר ריק אם אין שינוי"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordChanged(e.target.value !== "");
              }}
            />
            <img
              className="input-icon"
              src={PasswordIcon}
              alt="Password Icon"
            />
          </div>
          {passwordChanged && (
            <p className="password-note">
              שים לב: שינוי הסיסמה יעדכן את הסיסמה הקיימת
            </p>
          )}
        </div>
        <div className="form-buttons">
          <button onClick={handleSubmit} className="update-button">
            עדכון
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSector;
