import { FC } from "react";
import "./ObjectCard.scss";
import { ObjectLocation } from "../../../../redux/models/Interfaces";
import { DeleteIcon, EditIcon } from "../../../photos";

interface ObjectCardProps {
  object: ObjectLocation;
  onShowConfirm: (object: ObjectLocation) => void;
  onEditObject: (object: ObjectLocation) => void;
}

const ObjectSectionTitles = {
  ObjectName: " שם האובייקט : ",
  ObjectDescription: " תיאור : ",
};

const ObjectsCard: FC<ObjectCardProps> = ({
  object,
  onShowConfirm,
  onEditObject,
}) => {
  return (
    <div className="object-card">
      <div className="card-header-object">
        <div className="title-object">{object.name}</div>
        <div className="buttons-object">
          <button
            className="edit-button-object"
            onClick={(e) => {
              e.preventDefault();
              onEditObject(object);
            }}
          >
            <img className="edit-icon-object" src={EditIcon} alt="Edit" />
          </button>
          <button
            className="delete-button-object"
            onClick={(e) => {
              e.preventDefault();
              onShowConfirm(object);
            }}
          >
            <img className="delete-icon-object" src={DeleteIcon} alt="Delete" />
          </button>
        </div>
      </div>
      <div className="object-card-content-object">
        <div className="sections-object">
          <div className="section-title-object">
            {ObjectSectionTitles.ObjectName + object.name}
          </div>
          {object.description && (
            <div className="section-title-object">
              {ObjectSectionTitles.ObjectDescription + object.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObjectsCard;
