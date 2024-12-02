import { FC } from "react";
import "./LocationCard.scss";
import { Location } from "../../../../redux/models/Interfaces";
import { DeleteIcon, EditIcon } from "../../../photos";

interface LocationCardProps {
  object: Location;
  onShowConfirm: (location: Location) => void;
  onEditLocation: (location: Location) => void;
}

const LocationSectionTitles = {
  LocationName: " שם החדר : ",
  LocationDescription: " תיאור : ",
  objectsNumber: " מספר האובייקטים : ",
};

const LocationCard: FC<LocationCardProps> = ({
  object,
  onShowConfirm,
  onEditLocation,
}) => {
  return (
    <div className="Location-card">
      <div className="card-header-location-card">
        <div className="title-location-card">{object.name}</div>
        <div className="buttons-location-card">
          <button
            className="edit-button-location-card"
            onClick={(e) => {
              e.preventDefault();
              onEditLocation(object);
            }}
          >
            <img
              className="edit-icon-location-card"
              src={EditIcon}
              alt="Edit"
            />
          </button>
          <button
            className="delete-button-location-card"
            onClick={(e) => {
              e.preventDefault();
              onShowConfirm(object);
            }}
          >
            <img
              className="delete-icon-location-card"
              src={DeleteIcon}
              alt="Delete"
            />
          </button>
        </div>
      </div>
      <div className="Location-card-content-location-card">
        <div className="sections-location-card">
          <div className="section-title-location-card">
            {LocationSectionTitles.LocationName + object.name}
          </div>
          {object.description !== "" && object.description !== undefined && (
            <div className="section-title-location-card">
              {LocationSectionTitles.LocationDescription + object.description}
            </div>
          )}
          <div className="section-title-location-card">
            {/* {LocationSectionTitles.objectsNumber + object.objects.length} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
