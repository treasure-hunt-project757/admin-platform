import { FC, useEffect, useState } from "react";
import LocationCard from "./LocationCard/LocationCard";
import "./LocationPage.scss";
import HomePage from "../../components/Common/HomePage/HomePage";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import { locationAPI } from "../../../redux/services/LocationApi";
import { setLocations } from "../../../redux/slices/saveAllData";
import ConfirmationDialog from "../../components/Common/ConfirmationDialog/ConfirmationDialog";
import { Location } from "../../../redux/models/Interfaces";
import { buttonsName } from "../../../redux/models/Types";
import {
  setCard,
  setIsObjectsPage,
  setPage,
} from "../../../redux/slices/GlobalStates";
import Loader from "../../components/Common/LoadingSpinner/Loader";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../../components/Common/AlertMessage/AlertMessage";

const LocationsPage: FC = () => {
  // const page = useSelector((state: RootState) => state.globalStates.page);
  const dispatch = useDispatch();
  const locations = useSelector((state: RootState) => state.AllData.locations);
  const [showConfirm, setShowConfirm] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      setLoadingMessage("טוען מקומות...");
      try {
        const fetchedLocations = await locationAPI.getAllLocations();
        dispatch(setLocations(fetchedLocations));
        setLoadingMessage("");
      } catch (error) {
        console.error("Error fetching locations: ", error);
        setLoadingMessage("שגיאה בטעינת מקומות");
      } finally {
        setIsLoading(false);
      }
      dispatch(setIsObjectsPage(false));
      dispatch(setPage(buttonsName.Locations));
    };
    fetchLocations();
  }, [dispatch, refetchTrigger]);

  const handleDelete = (location: Location) => {
    setLocationToDelete(location);
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (locationToDelete) {
      setShowConfirm(false);
      setIsLoading(true);
      setLoadingMessage("מוחק מקום ...");
      try {
        const response = await locationAPI.deleteLocation(
          locationToDelete.locationID
        );
        if (response.status === 200) {
          setRefetchTrigger((prev) => prev + 1);
          setLoadingMessage("מקום נמחקה בהצלחה!");
        }
      } catch (error: any) {
        console.error("Error deleting location: ", error);
        setAlertMessage("שגיאה במחיקת המקום:\n" + (error || "Unknown error"));
      } finally {
        setIsLoading(false);
        setLoadingMessage("");
      }
    }
  };

  const handleEdit = (location: Location) => {
    dispatch(setCard(location));
    navigate("/EditLocation");
  };
  return (
    <div dir="rtl">
      <Loader isLoading={isLoading} message={loadingMessage} />
      {alertMessage && <AlertMessage message={alertMessage} />}

      <HomePage
        objects={locations}
        page="Location"
        Component={(props) => (
          <LocationCard
            {...props}
            onShowConfirm={handleDelete}
            onEditLocation={handleEdit}
          />
        )}
        addButton="הוספת חדר חדש"
        addButtonPath="AddLocation"
      />
      {showConfirm && (
        <ConfirmationDialog
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowConfirm(false)}
          message={`את/ה בטוח/ה שאת/ה רוצה למחוק את המקום "${locationToDelete?.name}"?\nפעולה זו תמחק גם את האובייקטים בתוך המקום`}
        />
      )}
    </div>
  );
};

export default LocationsPage;
