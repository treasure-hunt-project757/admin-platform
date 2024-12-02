import { FC } from "react";
import { ObjectLocation } from "../../../../../redux/models/Interfaces";
import "./ChooseCardObject.scss";

interface ChoosableObjectCardProps {
  object: ObjectLocation;
}

const ChoosableObjectCard: FC<ChoosableObjectCardProps> = ({ object }) => {
  return (
    <div className="choose-object-card">
      <div className="card-header-choose-object">
        <div className="title-choose-object">{object.name}</div>
      </div>
      <div className="choose-object-card-content">
        <div className="sections-choose-object">
          <div className="section-title-choose-object">
            {!!object.description && object.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChoosableObjectCard;
