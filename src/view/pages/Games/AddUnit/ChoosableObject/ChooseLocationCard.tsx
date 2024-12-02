import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Location } from "../../../../../redux/models/Interfaces";
import "./ChooseCard.scss";

interface ChoosableLocationCardProps {
  object: Location;
  navigationPath: string;
  setAlertMessage: (message: string) => void;
}

const ChoosableLocationCard: FC<ChoosableLocationCardProps> = ({
  object,
  navigationPath,
  setAlertMessage,
}) => {
  const navigate = useNavigate();
  // const handleClick = () => {
  //   if (object.objectsList?.length === 0) {
  //   } else {
  //     const objectPagePath =
  //       navigationPath === "/EditUnit"
  //         ? "/ChooseObject-edit"
  //         : "/ChooseObject-add";
  //     navigate(`${objectPagePath}/${object.locationID}`, {
  //       state: { selectedLocation: object, fromParent: navigationPath },
  //     });
  //   }
  // };
  const handleClick = () => {
    if (object.objectsList?.length === 0) {
      setAlertMessage("אין אובייקטים עבור המיקום הזה");
    } else {
      let objectPagePath;
      switch (navigationPath) {
        case "/EditUnit":
          objectPagePath = "/ChooseObject-edit";
          break;
        case "/Edit-EditUnit":
          objectPagePath = "/edit-ChooseObject-edit";
          break;
        case "/AddUnit":
          objectPagePath = "/ChooseObject-add";
          break;
        case "/Edit-AddUnit":
          objectPagePath = "/edit-ChooseObject-add";
          break;
      }

      navigate(`${objectPagePath}/${object.locationID}`, {
        state: { selectedLocation: object, fromParent: navigationPath },
      });
    }
  };

  return (
    <div className="Location-card" onClick={handleClick} dir="rtl">
      <div className="card-header">
        <div className="title">{object.name}</div>
        <div className="buttons">
          <button className="edit-button"></button>
          <button className="delete-button"></button>
        </div>
      </div>
      <div className="Location-card-content">
        <div className="sections">
          <div className="section-title">
            {!!object.description && object.description}
          </div>
          <div className="section-title">
            {`מספר האוביקטים: ${object.objectsList?.length || 0}`}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChoosableLocationCard;
