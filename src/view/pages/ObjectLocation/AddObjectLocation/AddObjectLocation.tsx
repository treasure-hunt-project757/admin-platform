import React, { useState } from "react";
import { UploadFileIcon } from "../../../photos";
import "./AddObjectLocation.scss";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../redux/store";
import { setCard } from "../../../../redux/slices/GlobalStates";
import { ObjectLocation } from "../../../../redux/models/Interfaces";
import { objectAPI } from "../../../../redux/services/ObjectLocationApi";
import { Location } from "../../../../redux/models/Interfaces";
import Loader from "../../../components/Common/LoadingSpinner/Loader";
import AlertMessage from "../../../components/Common/AlertMessage/AlertMessage";

interface FileWithPreview extends File {
  preview: string;
}

const AddNewObjectHebrew = {
  AddNewObjects: "הוספת אובייקט",
  Name: "שם : ",
  Description: "תיאור : ",
  UploadImages: "העלאת תמונות : ",
  Delete_Image: "מחיקת תמונה",
  ImagesNumber: "מספר תמונות: ",
  MaxFileSize: "גודל מקסימלי: 32 MB",
  Save: "שמירה",
  SizeLimit: "גודל הקבצים עולה על המגבלה של 32 מגה-בייט. מחק כדי לשמור.",
  CurrentSize: "גודל נוכחי: ",
  ExceedingBy: "חריגה ב: ",
  TotalSize: "גודל עד כה: ",
};

const MAX_FILE_SIZE = 32 * 1024 * 1024; // 32 MB in bytes

const AddObjectLocation: React.FC = () => {
  const location = useSelector(
    (state: RootState) => state.globalStates.selectedCard
  ) as Location;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [objectName, setObjectName] = useState("");
  const [objectDescription, setObjectDescription] = useState("");
  const [pics, setPics] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [totalSize, setTotalSize] = useState<number>(0);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (newFiles) {
      const filesWithPreview = Array.from(newFiles).map((file) => ({
        ...file,
        preview: URL.createObjectURL(file),
      }));
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
      setPics((prevPics) => [...prevPics, ...Array.from(newFiles)]);

      const newTotalSize = [...pics, ...Array.from(newFiles)].reduce(
        (acc, file) => acc + file.size,
        0
      );
      setTotalSize(newTotalSize);
    }
  };

  const handleDeleteImage = (index: number) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, idx) => idx !== index)
    );
    setPics((prevPics) => {
      const updatedPics = prevPics.filter((_, idx) => idx !== index);
      const newTotalSize = updatedPics.reduce(
        (acc, file) => acc + file.size,
        0
      );
      setTotalSize(newTotalSize);
      return updatedPics;
    });
  };

  const handleSaveObject = async () => {
    if (!objectName.trim()) {
      setAlertMessage("לאובייקט חייב להיות שם.");
      return;
    }
    const newObject: ObjectLocation = {
      objectID: Date.now(),
      name: objectName,
      description: objectDescription,
    };
    setIsLoading(true);
    setLoadingMessage("שומר אובייקט ...");
    const formData = new FormData();
    formData.append(
      "locationObject",
      new Blob([JSON.stringify(newObject)], { type: "application/json" })
    );
    if (pics.length > 0) {
      pics.forEach((pic) => {
        formData.append("images", pic);
      });
    }

    try {
      await objectAPI.createObject(location.locationID, formData);
      setLoadingMessage("אובייקט נשמר בהצלחה!");
      setTimeout(() => {
        setIsLoading(false);
        setLoadingMessage("");
        dispatch(setCard(location));
        navigate(`/ObjectsPage/${location.locationID}`);
      }, 1000);
    } catch (error: any) {
      const errorMessage = error;
      console.log("errors msg is ", error)
      setAlertMessage(errorMessage.includes('Name Must Be Unique')
        ? "שגיאה בשמירת אובייקט, לאובייקט צריך להיות שם ייחודי"
        : "שגיאה בשמירת אובייקט"
      );

      setLoadingMessage(errorMessage.includes('Name Must Be Unique')
        ? "שגיאה בשמירת אובייקט, לאובייקט צריך להיות שם ייחודי"
        : "שגיאה בשמירת אובייקט"
      );

      setTimeout(() => {
        setIsLoading(false);
        setLoadingMessage("");
      }, 2000);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="main-container-add-object" dir="rtl">
      <Loader isLoading={isLoading} message={loadingMessage} />
      {alertMessage && <AlertMessage message={alertMessage} />}
      <div className="overlay" />
      <div className="add-object-container">
        <h2 className="add-object-title">{AddNewObjectHebrew.AddNewObjects}</h2>
        <div className="input-group">
          <label className="input-label">{AddNewObjectHebrew.Name}</label>
          <input
            type="text"
            className="object-input"
            value={objectName}
            onChange={(e) => setObjectName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label className="input-label">
            {AddNewObjectHebrew.Description}
          </label>
          <textarea
            className="object-textarea"
            value={objectDescription}
            onChange={(e) => setObjectDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="input-group file-upload-group">
          <label className="input-label">
            {AddNewObjectHebrew.UploadImages}
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
            {AddNewObjectHebrew.ImagesNumber} {selectedFiles.length}
          </div>
          <div className="image-count">{AddNewObjectHebrew.MaxFileSize}</div>
          <div className="image-count">
            {AddNewObjectHebrew.TotalSize} {formatSize(totalSize)}
          </div>
          {totalSize > MAX_FILE_SIZE && (
            <div className="image-count" style={{ color: "#ea3d85" }}>
              {AddNewObjectHebrew.SizeLimit}
              <br />
              {AddNewObjectHebrew.ExceedingBy}{" "}
              {formatSize(totalSize - MAX_FILE_SIZE)}
            </div>
          )}
          {selectedFiles.length > 0 && (
            <div className="image-grid">
              {selectedFiles.map((file, index) => (
                <div key={index} className="image-grid-item">
                  <img
                    className="img-media"
                    src={file.preview}
                    alt={`Uploaded ${index}`}
                  />
                  <button
                    className="delete-image-btn"
                    onClick={() => handleDeleteImage(index)}
                  >
                    {AddNewObjectHebrew.Delete_Image}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleSaveObject}
          className="save-object-button"
          disabled={totalSize > MAX_FILE_SIZE}
          style={{ opacity: totalSize > MAX_FILE_SIZE ? 0.5 : 1 }}
        >
          {AddNewObjectHebrew.Save}
        </button>
      </div>
    </div>
  );
};

export default AddObjectLocation;
