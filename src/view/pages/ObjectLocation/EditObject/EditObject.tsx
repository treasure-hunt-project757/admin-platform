import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UploadFileIcon } from "../../../photos";
import { RootState } from "../../../../redux/store";
import { setCard } from "../../../../redux/slices/GlobalStates";
import {
  ObjectLocation,
  Location,
  ObjectImage,
} from "../../../../redux/models/Interfaces";
import { objectAPI } from "../../../../redux/services/ObjectLocationApi";
import Loader from "../../../components/Common/LoadingSpinner/Loader";
import AlertMessage from "../../../components/Common/AlertMessage/AlertMessage";
import "./EditObject.scss";
const EditObjectHebrew = {
  EditObject: "עריכת אובייקט",
  Name: "שם : ",
  Description: "תיאור : ",
  UploadImages: "העלאת תמונות : ",
  Delete_Image: "מחיקת תמונה",
  ImagesNumber: "מספר תמונות: ",
  Save: "שמירה",
  NoImagesAvailable: "אין תמונות",
};

const EditObjectLocation: React.FC = () => {
  const object = useSelector(
    (state: RootState) => state.globalStates.selectedCard
  );
  const location = useSelector(
    (state: RootState) => state.globalStates.selectedCard
  ) as Location;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [objectName, setObjectName] = useState(object.name);
  const [objectDescription, setObjectDescription] = useState(
    object.description || ""
  );
  const [objectImages, setObjectImages] = useState<ObjectImage[]>(
    object.objectImages || []
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setNewFiles((prevFiles) => [...prevFiles, ...Array.from(selectedFiles)]);
    }
  };

  const handleDeleteExistingImage = (id: number) => {
    setDeletedImageIds((prev) => [...prev, id]);
    setObjectImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleDeleteNewImage = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveObject = async () => {
    if (!objectName.trim()) {
      setAlertMessage("An object must have a name.");
      return;
    }

    setIsLoading(true);
    setLoadingMessage("מעדכן אובייקט...");

    const updatedObject: ObjectLocation = {
      ...object,
      name: objectName,
      description: objectDescription,
    };

    const formData = new FormData();
    formData.append(
      "object",
      new Blob([JSON.stringify(updatedObject)], { type: "application/json" })
    );

    newFiles.forEach((file) => {
      formData.append("images", file);
    });

    if (deletedImageIds.length > 0) {
      formData.append(
        "deletedImageIds",
        new Blob([JSON.stringify(deletedImageIds)], {
          type: "application/json",
        })
      );
    }

    try {
      await objectAPI.updateObject(object.objectID, formData);
      setLoadingMessage("אובייקט עודכן בהצלחה!");
      setTimeout(() => {
        setIsLoading(false);
        setLoadingMessage("");
        dispatch(setCard(location));
        navigate(`/ObjectsPage/${location.locationID}`);
      }, 1000);
    } catch (error: any) {
      console.error("Error updating object:", error);
      setAlertMessage("אירעה שגיאה בעת עדכון האובייקט. אנא נסה שוב.");
      setLoadingMessage("שגיאה בעדכון אובייקט");
      setTimeout(() => {
        setIsLoading(false);
        setLoadingMessage("");
      }, 2000);
    }
  };

  return (
    <div className="main-container-edit-object" dir="rtl">
      <Loader isLoading={isLoading} message={loadingMessage} />
      {alertMessage && <AlertMessage message={alertMessage} />}
      <div className="overlay" />
      <div className="edit-object-container">
        <h2 className="edit-object-title">{EditObjectHebrew.EditObject}</h2>
        <div className="input-group">
          <label className="input-label">{EditObjectHebrew.Name}</label>
          <input
            type="text"
            className="object-input"
            value={objectName}
            onChange={(e) => setObjectName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label className="input-label">{EditObjectHebrew.Description}</label>
          <textarea
            className="object-textarea"
            value={objectDescription}
            onChange={(e) => setObjectDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="options-container">
          <div className="option-section">
            <label htmlFor="file-upload" className="input-label">
              {EditObjectHebrew.UploadImages}
            </label>
            <label htmlFor="file-upload" className="file-upload-label">
              <img
                src={UploadFileIcon}
                alt="Upload File"
                className="file-upload-icon"
              />
            </label>
            <input
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.webp"
              id="file-upload"
              className="file-input"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          <div className="object-media-list">
            <div className="image-count">
              {EditObjectHebrew.ImagesNumber}{" "}
              {objectImages.length + newFiles.length}
            </div>
            <div className="object-media-list">
              <div className="image-count">
                {EditObjectHebrew.ImagesNumber}{" "}
                {objectImages.length + newFiles.length}
              </div>
              {objectImages.length > 0 || newFiles.length > 0 ? (
                <div className="image-grid">
                  {objectImages.map((img: ObjectImage) => (
                    <div key={img.id} className="image-grid-item">
                      <img
                        className="img-media"
                        src={img.imageUrl}
                        alt={img.name}
                      />
                      <button
                        className="delete-image-btn"
                        onClick={() => handleDeleteExistingImage(img.id)}
                      >
                        {EditObjectHebrew.Delete_Image}
                      </button>
                    </div>
                  ))}
                  {newFiles.map((file, index) => (
                    <div key={`new-${index}`} className="image-grid-item">
                      <img
                        className="img-media"
                        src={URL.createObjectURL(file)}
                        alt={`New ${index}`}
                      />
                      <button
                        className="delete-image-btn"
                        onClick={() => handleDeleteNewImage(index)}
                      >
                        {EditObjectHebrew.Delete_Image}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>{EditObjectHebrew.NoImagesAvailable}</p>
              )}
            </div>
          </div>
        </div>
        <button onClick={handleSaveObject} className="save-object-button">
          {EditObjectHebrew.Save}
        </button>
      </div>
    </div>
  );
};

export default EditObjectLocation;
