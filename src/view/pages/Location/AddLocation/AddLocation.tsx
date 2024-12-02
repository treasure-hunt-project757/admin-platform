import { useState } from "react";
import "./AddLocation.scss";
import { useNavigate } from "react-router-dom";
import { locationAPI } from "../../../../redux/services/LocationApi";
import { LocationTBC } from "../../../../redux/models/Interfaces";
import Loader from "../../../components/Common/LoadingSpinner/Loader";
import AlertMessage from "../../../components/Common/AlertMessage/AlertMessage";

const AddLocationHebrew = {
  AddNewRoom: "הוספת מקום חדש",
  Name: "שם : ",
  Description: "תיאור : ",
  Floor: "קומה : ",
  // UploadFiles: "העלאת קבצים : ",
  AddObjects: "הוספת אובייקטים",
  Save: "שמירה",
};

const AddLocation = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [floor, setFloor] = useState<number | undefined>(undefined);
  // const [mediaFile, setMediaFile] = useState<File | null>(null);
  // const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedFiles = event.target.files;
  //   if (selectedFiles && selectedFiles.length > 0) {
  //     const file = selectedFiles[0];
  //     setMediaFile(file);

  //     const previewUrl = URL.createObjectURL(file);
  //     setMediaPreview(previewUrl);
  //   }
  // };

  const handleSave = () => {
    if (!name.trim() || floor === undefined) {
      setAlertMessage("שם ומספר קומה הם שדות חובה.");
      return;
    }
    const location: LocationTBC = {
      locationID: 0,
      name,
      description,
      floor: floor!,
      qrcode: "",
    };
    setIsLoading(true);
    setLoadingMessage("שומר מקום ...");
    const formData = new FormData();
    formData.append(
      "location",
      new Blob([JSON.stringify(location)], { type: "application/json" })
    );
    // if (mediaFile) {
    //   formData.append("image", mediaFile);
    // }

    locationAPI
      .createLocation(formData)
      .then(() => {
        setLoadingMessage("מקום נשמר בהצלחה!");
        setTimeout(() => {
          setIsLoading(false);
          setLoadingMessage("");
          navigate("/Locations");
        }, 1000);
      })
      .catch((error) => {
        console.error("Detailed error:", error.response || error);
        setAlertMessage("שגיאה בשמירת המקום");
        setLoadingMessage("שגיאה בשמירת המקום");
        setTimeout(() => {
          setIsLoading(false);
          setLoadingMessage("");
        }, 2000);
      });
  };

  return (
    <div className="main-container-add-location" dir="rtl">
      <Loader isLoading={isLoading} message={loadingMessage} />
      {alertMessage && <AlertMessage message={alertMessage} />}
      <div className="overlay" />
      <div className="add-location-container">
        <h2 className="add-location-title">{AddLocationHebrew.AddNewRoom}</h2>
        <div className="input-group">
          <label className="input-label">{AddLocationHebrew.Name}</label>
          <input
            type="text"
            className="location-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label className="input-label">{AddLocationHebrew.Description}</label>
          <textarea
            className="location-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="input-group">
          <label className="input-label">{AddLocationHebrew.Floor}</label>
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
          <label className="input-label">{AddLocationHebrew.UploadFiles}</label>
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
              <button
                className="delete-image-btn"
                onClick={() => {
                  URL.revokeObjectURL(mediaPreview);
                  setMediaFile(null);
                  setMediaPreview(null);
                }}
              >
                מחיקה
              </button>
            </div>
          )}
        </div> */}
        <div className="location-buttons">
          <button className="save-location-button" onClick={handleSave}>
            {AddLocationHebrew.Save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLocation;
