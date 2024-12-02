import React, { useState, useEffect } from "react";
import "./EditLocation.scss";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { locationAPI } from "../../../../redux/services/LocationApi";
import { Location } from "../../../../redux/models/Interfaces";
import Loader from "../../../components/Common/LoadingSpinner/Loader";
import AlertMessage from "../../../components/Common/AlertMessage/AlertMessage";

const EditLocationHebrew = {
  EditRoom: "עריכת מקום",
  Name: "שם : ",
  Description: "תיאור : ",
  Floor: "קומה : ",
  // UploadFiles: "העלאת קבצים : ",
  Save: "שמירה",
  DeleteImage: "מחק תמונה",
};

const EditLocation: React.FC = () => {
  const navigate = useNavigate();
  const location = useSelector(
    (state: RootState) => state.globalStates.selectedCard
  ) as Location;

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [floor, setFloor] = useState<number | undefined>(undefined);
  // const [mediaFile, setMediaFile] = useState<File | null>(null);
  // const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  // const [deleteImage, setDeleteImage] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  useEffect(() => {
    if (location) {
      setName(location.name || "");
      setDescription(location.description || "");
      setFloor(location.floor);
      if (location.locationImagePublicUrl) {
        // setMediaPreview(location.locationImagePublicUrl);
      }
    }
  }, [location]);

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedFiles = event.target.files;
  //   if (selectedFiles && selectedFiles.length > 0) {
  //     const file = selectedFiles[0];
  //     setMediaFile(file);
  //     setDeleteImage(false);

  //     const previewUrl = URL.createObjectURL(file);
  //     setMediaPreview(previewUrl);
  //   }
  // };

  // const handleDeleteImage = () => {
  //   URL.revokeObjectURL(mediaPreview || "");
  //   setMediaFile(null);
  //   setMediaPreview(null);
  //   setDeleteImage(true);
  // };

  const handleSave = () => {
    if (!name.trim() || floor === undefined) {
      setAlertMessage("שם ומספר קומה הם שדות חובה.");
      return;
    }
    const updatedLocation: Location = {
      ...location,
      name,
      description,
      floor: floor!,
    };
    setIsLoading(true);
    setLoadingMessage("עדכון מקום ...");

    const formData = new FormData();
    formData.append(
      "location",
      new Blob([JSON.stringify(updatedLocation)], { type: "application/json" })
    );
    // if (mediaFile) {
    //   formData.append("image", mediaFile);
    // }
    // formData.append("deleteImage", deleteImage.toString());

    locationAPI
      .updateLocation(updatedLocation.locationID, formData)
      .then(() => {
        setLoadingMessage("מקום עודכן בהצלחה!");
        setTimeout(() => {
          setIsLoading(false);
          setLoadingMessage("");
          navigate("/Locations");
        }, 1000);
      })
      .catch((error) => {
        console.error("Detailed error:", error);
        setAlertMessage("שגיאה בעדכון המקום");
        setLoadingMessage("שגיאה בעדכון המקום");
        setTimeout(() => {
          setIsLoading(false);
          setLoadingMessage("");
        }, 2000);
      });
  };

  return (
    <div className="main-container-edit-location" dir="rtl">
      <Loader isLoading={isLoading} message={loadingMessage} />
      {alertMessage && <AlertMessage message={alertMessage} />}
      <div className="overlay" />
      <div className="edit-location-container">
        <h2 className="edit-location-title">{EditLocationHebrew.EditRoom}</h2>
        <div className="input-group">
          <label className="input-label">{EditLocationHebrew.Name}</label>
          <input
            type="text"
            className="location-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label className="input-label">
            {EditLocationHebrew.Description}
          </label>
          <textarea
            className="location-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="input-group">
          <label className="input-label">{EditLocationHebrew.Floor}</label>
          <input
            type="number"
            className="location-input"
            value={floor === undefined ? "" : floor}
            onChange={(e) => {
              const value = e.target.value;
              setFloor(value === "" ? undefined : Number(value));
            }}
          />
        </div>

        {/* <div className="input-group file-upload-group">
          <label className="input-label">
            {EditLocationHebrew.UploadFiles}
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
            id="file-upload"
            className="file-input"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {mediaPreview && (
            <div>
              <img
                src={mediaPreview}
                alt="Uploaded"
                style={{ width: 100, height: 100 }}
              />
              <button className="delete-image-btn" onClick={handleDeleteImage}>
                {EditLocationHebrew.DeleteImage}
              </button>
            </div>
          )}
        </div> */}
        <div className="location-buttons">
          <button className="save-location-button" onClick={handleSave}>
            {EditLocationHebrew.Save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLocation;
