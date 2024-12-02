import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HospitalIcon,
  DoctorUserIcon,
  PasswordIcon,
  ViewPasswordIcon,
  HeroPhoto,
} from "../../../../photos";
import "./NewSector.scss";
import { adminAPI } from "../../../../../redux/services/AdminApi";
import { AdminTBC } from "../../../../../redux/models/Interfaces";
import Loader from "../../../../components/Common/LoadingSpinner/Loader";
import AlertMessage from "../../../../components/Common/AlertMessage/AlertMessage";

const NewSector = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [sector, setSector] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const isFormValid = (): boolean => {
    return username.trim() !== "" && sector.trim() !== "";
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setAlertMessage("שם משתמש ותפקיד לא יכולים להיות ריקים");
      return;
    }
    setIsLoading(true);
    setLoadingMessage("מוסיף אדמין...");
    const newAdmin: AdminTBC = { username, password, sector };
    try {
      await adminAPI.createSectorAdmin(newAdmin);
      setAlertMessage("אדמין נוצר בהצלחה");
      navigate("/Sectors");
    } catch (error: any) {
      console.error("Failed to create sector admin:", error.response.data);
      if (
        error.response.data.includes("Admin with this sector already exists.")
      ) {
        setAlertMessage("מחלקה כבר קיימת במערכת");
      } else {
        setAlertMessage("שגיאה בייצור אדמין");
      }
      setLoadingMessage("שגיאה בייצור אדמין");
      setTimeout(() => {
        setIsLoading(false);
        setLoadingMessage("");
      }, 2000);
    }
  };

  return (
    <div className="new-sector-page">
      <Loader isLoading={isLoading} message={loadingMessage} />
      {alertMessage && <AlertMessage message={alertMessage} />}
      <div className="hero-container-part-one">
        <div className="hero-content">
          <img className="hero-img" src={HeroPhoto} alt="hero-photo" />
          <div className="hero-right">
            <div className="title">הוספת</div>
            <div className="title">משתמש חדש</div>
          </div>
        </div>
      </div>
      <div className="inputs-button">
        <div className="new-sector">
          <input
            className="sector-input"
            placeholder="סקטור"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          />
          <img
            className="hospital-icon"
            src={HospitalIcon}
            alt="hospital-icon"
          />
        </div>
        <div className="admin-user-name">
          <input
            className="admin-user-name-input"
            placeholder="שם משתמש"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <img className="navbar-icon" src={DoctorUserIcon} alt="admin-icon" />
        </div>
        <div className="admin-code">
          <input
            className="admin-code-input"
            type="password"
            placeholder=" סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <img className="navbar-icon" src={PasswordIcon} alt="password-icon" />
          <img
            className="view-password-icon"
            src={ViewPasswordIcon}
            alt="password-icon"
          />
        </div>
        <div className="final-buttons">
          <button className="button-s" onClick={handleSubmit}>
            הוספה
          </button>
          <Link to="/Sectors">
            <button className="button-s">ביטול</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewSector;
