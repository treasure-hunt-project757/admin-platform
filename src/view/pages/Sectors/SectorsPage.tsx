import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SectorCard from "./SectorCard/SectorCard";
import HomePage from "../../components/Common/HomePage/HomePage";
import ConfirmationDialog from "../../components/Common/ConfirmationDialog/ConfirmationDialog";
import Loader from "../../components/Common/LoadingSpinner/Loader";
import { RootState } from "../../../redux/store";
import { setSectors } from "../../../redux/slices/saveAllData";
import {
  setCard,
  setIsObjectsPage,
  setPage,
  setSector,
} from "../../../redux/slices/GlobalStates";
import { adminAPI } from "../../../redux/services/AdminApi";
import { buttonsName } from "../../../redux/models/Types";
import { Admin, UserRole } from "../../../redux/models/Interfaces";
import "./SectorsPage.scss";
import AlertMessage from "../../components/Common/AlertMessage/AlertMessage";

const SectorsPage: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admins = useSelector((state: RootState) => state.AllData.Sectors);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const adminStr = localStorage.getItem("admin");
  const currAdmin: Admin = adminStr ? JSON.parse(adminStr) : null;

  useEffect(() => {
    const fetchSectors = async () => {
      setIsLoading(true);
      setLoadingMessage("טוען משתמשים...");
      try {
        const sectors = await adminAPI.getAllAdmins();
        dispatch(setSectors(sectors));
        dispatch(setSector(sectors[0]));
        setLoadingMessage("");
      } catch (error) {
        console.error("Error fetching sectors:", error);
        setLoadingMessage("שגיאה בטעינת משתמשים");
      } finally {
        setIsLoading(false);
      }
      dispatch(setIsObjectsPage(false));
      dispatch(setPage(buttonsName.Sectors));
    };
    fetchSectors();
  }, [dispatch, refetchTrigger]);

  const isMainAdmin = (role: UserRole | string | number): boolean => {
    if (typeof role === "string") {
      return role === UserRole[UserRole.MainAdmin];
    } else if (typeof role === "number") {
      return role === UserRole.MainAdmin;
    }
    return role === UserRole.MainAdmin;
  };

  const checkAdminPermission = (
    admin: Admin,
    action: "delete" | "edit" | "add"
  ): boolean => {
    if (action === "add" && !isMainAdmin(currAdmin.role)) {
      setAlertMessage("אין הרשאה להוסיף משתמש חדש");
      return false;
    }
    if (action !== "add" && isMainAdmin(admin.role)) {
      setAlertMessage(
        `אי אפשר ${action === "delete" ? "למחוק" : "לערוך"} מנהל ראשי`
      );
      return false;
    }
    if (!isMainAdmin(currAdmin.role)) {
      setAlertMessage(`אין הרשאה ${action === "delete" ? "למחוק" : "לערוך"}`);
      return false;
    }
    return true;
  };

  const handleDelete = (admin: Admin) => {
    if (checkAdminPermission(admin, "delete")) {
      setAdminToDelete(admin);
      setShowConfirm(true);
    }
  };

  const handleEdit = (admin: Admin) => {
    if (checkAdminPermission(admin, "edit")) {
      dispatch(setCard(admin));
      navigate("/EditSector");
    }
  };

  const handleDeleteConfirm = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    setLoadingMessage("מוחק אדמין ...");

    if (adminToDelete) {
      try {
        const response = await adminAPI.deleteAdmin(adminToDelete.adminID);
        if (response.status === 200) {
          dispatch(
            setSectors(
              admins.filter((obj) => obj.adminID !== adminToDelete.adminID)
            )
          );
          setLoadingMessage("אדמין נמחק בהצלחה!");
          setTimeout(() => {
            setRefetchTrigger((prev) => prev + 1);
            setIsLoading(false);
            setLoadingMessage("");
          }, 500);
        }
      } catch (error: any) {
        dispatch(setSectors(admins));
        setLoadingMessage("שגיאה במחיקת אדמין");
        console.error("Error deleting admin:", error);
        setTimeout(() => {
          setIsLoading(false);
          setLoadingMessage("");
        }, 2000);
      }
    }
  };
  const handleAdd = (): boolean => {
    if (isMainAdmin(currAdmin.role)) {
      return true;
    } else {
      setAlertMessage("אין הרשאה להוסיף משתמש חדש");
      return false;
    }
  };

  return (
    <div dir="rtl">
      <Loader isLoading={isLoading} message={loadingMessage} />
      {alertMessage && <AlertMessage message={alertMessage} />}
      <HomePage
        objects={admins}
        page="Sector"
        Component={(props) => (
          <SectorCard
            {...props}
            onShowConfirm={handleDelete}
            onEditAdmin={handleEdit}
          />
        )}
        // setCardOnClick={false}
        addButton="הוספת משתמש חדש"
        addButtonPath="AddSector"
        onAddClick={handleAdd}
      />
      {showConfirm && (
        <ConfirmationDialog
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowConfirm(false)}
          message={`האם אתה בטוח שברצונך למחוק את האדמין "${adminToDelete?.sector}"?\nבמידה וכן, כל המשימות והאובייקטים ישתייכו לאדמין הראשי`}
        />
      )}
    </div>
  );
};

export default SectorsPage;
