import React from "react";
import "./LocationDetails.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { DownloadIcon } from "../../../photos";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setObjects } from "../../../../redux/slices/saveAllData";

const LocationDetails: React.FC = () => {
  const location = useSelector(
    (state: RootState) => state.globalStates.selectedCard
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  if (!location) {
    return <div>Loading...</div>;
  }

  return (
    <div className="location-container" dir="rtl">
      <div className="overlay" />
      <div className="location-details">
        <div className="location-title">{location.name}</div>
        <div className="location-content">
          <div className="location-floor">
            <div className="location-floor-title">{" קומה : "}</div>
            <div className="floor">{location.floor}</div>
          </div>
          {location.description && (
            <div className="location-description">
              <div className="description-title">{"תיאור"}</div>
              <div className="description">{location.description}</div>
            </div>
          )}
          {location.locationImagePublicUrl && (
            <div className="location-image-container">
              <img src={location.locationImagePublicUrl} alt="Location" />
            </div>
          )}
          <div className="location-qr-section">
            <div className="location-qr">
              {location.qrcodePublicUrl ? (
                <img
                  src={location.qrcodePublicUrl}
                  alt="QR Code"
                  className="qr-code-image"
                  onError={(e) => {
                    console.error("Error loading QR code:", e);
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div>QR Code not available</div>
              )}
            </div>
            <button
              className="download-qr-btn"
              onClick={() => {
                if (location.qrcodePublicUrl) {
                  fetch(location.qrcodePublicUrl)
                    .then((response) => response.blob())
                    .then((blob) => {
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = `QR_${location.name}.png`;
                      document.body.appendChild(link);
                      link.click();
                      window.URL.revokeObjectURL(url);
                      document.body.removeChild(link);
                    })
                    .catch((error) =>
                      console.error("Error downloading QR code:", error)
                    );
                }
              }}
            >
              הורדת QR
              <img
                className="download-icon"
                src={DownloadIcon}
                alt="Download"
              />
            </button>
          </div>
          {location.objectsList && location.objectsList.length > 0 && (
            <button
              className="view-objects"
              onClick={() => {
                navigate(`/ObjectsPage/${location.locationID}`);
                dispatch(setObjects(location.objectsList));
              }}
            >
              הצג אובייקטים של החדר
            </button>
          )}
          <button
            className="view-objects"
            onClick={() => {
              navigate(`/AddObjectLocation`);
            }}
          >
            הוסף אובייקטים
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationDetails;
