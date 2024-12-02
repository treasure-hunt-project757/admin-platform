import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import HomePage from "../../components/Common/HomePage/HomePage";
import ObjectCard from "../ObjectLocation/ObjectCard/ObjectCard";
import "./ObjectsPage.scss";
import { setObjects } from "../../../redux/slices/saveAllData";
import { objectAPI } from "../../../redux/services/ObjectLocationApi";
import { ObjectLocation } from "../../../redux/models/Interfaces";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationDialog from "../../components/Common/ConfirmationDialog/ConfirmationDialog";
import { buttonsName } from "../../../redux/models/Types";
import {
  setCard,
  setIsObjectsPage,
  setPage,
} from "../../../redux/slices/GlobalStates";
import Loader from "../../components/Common/LoadingSpinner/Loader";
import AlertMessage from "../../components/Common/AlertMessage/AlertMessage";

const ObjectsPage: FC = () => {
  // const location = useSelector((state: RootState) => state.globalStates.selectedCard);
  const dispatch = useDispatch();
  const { locationID } = useParams<{ locationID: string }>();
  const objects = useSelector((state: RootState) => state.AllData.Objects);
  const [showConfirm, setShowConfirm] = useState(false);
  const [objectToDelete, setObjectToDelete] = useState<ObjectLocation | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  useEffect(() => {
    dispatch(setIsObjectsPage(true));
    const fetchObjects = async () => {
      if (locationID) {
        const objectsData = await objectAPI.getAllObjetsOfLocation(
          Number(locationID)
        );
        dispatch(setObjects(objectsData));
        dispatch(setPage(buttonsName.Locations));
        dispatch(setIsObjectsPage(true));
      }
    };
    fetchObjects();
  }, [locationID, dispatch, refetchTrigger]);

  const handleDelete = (object: ObjectLocation) => {
    setObjectToDelete(object);
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (objectToDelete) {
      setShowConfirm(false);
      setIsLoading(true);
      setLoadingMessage("מוחק אובייקט ...");
      try {
        const response = await objectAPI.deleteObject(objectToDelete.objectID);
        if (response.status === 200) {
          const message = objectToDelete.name + " אובייקט נמחק בהצלחה ";
          setAlertMessage(message);
          dispatch(
            setObjects(
              objects.filter((obj) => obj.objectID !== objectToDelete.objectID)
            )
          );
          setLoadingMessage(message);
          setTimeout(() => {
            setRefetchTrigger((prev) => prev + 1);
            setIsLoading(false);
            setLoadingMessage("");
          }, 500);
        }
      } catch (error) {
        dispatch(setObjects(objects));
        setAlertMessage("שגיאה במחיקת האובייקט:\n" + error);
        setLoadingMessage("שגיאה במחיקת האובייקט");
        setTimeout(() => {
          setIsLoading(false);
          setLoadingMessage("");
        }, 2000);
      }
    }
  };

  const handleEdit = (object: ObjectLocation) => {
    dispatch(setCard(object));
    if (locationID) {
      navigate(`/EditObject/${locationID}`);
    } else {
      console.error("LocationID is undefined");
    }
  };

  return (
    <div dir="rtl">
      <Loader isLoading={isLoading} message={loadingMessage} />
      {alertMessage && <AlertMessage message={alertMessage} />}
      {
        <HomePage
          objects={objects}
          page="Object"
          Component={(props) => (
            <ObjectCard
              {...props}
              onShowConfirm={handleDelete}
              onEditObject={handleEdit}
            />
          )}
          addButton="הוספת אובייקט חדש"
          addButtonPath="AddObjectLocation"
        />
      }
      {showConfirm && (
        <ConfirmationDialog
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowConfirm(false)}
          message={`את/ה בטוח/ה שאת/ה רוצה למחוק את האובייקט "${objectToDelete?.name}"?`}
        />
      )}
    </div>
  );
};

export default ObjectsPage;
