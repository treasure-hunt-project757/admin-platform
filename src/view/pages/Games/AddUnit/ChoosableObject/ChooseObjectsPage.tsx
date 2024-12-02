import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Location,
  ObjectLocation,
} from "../../../../../redux/models/Interfaces";
import ChoosableObjectCard from "./ChooseObjectCard";
import "./ChooseObjectPage.scss";
import { setIsObjectsPage } from "../../../../../redux/slices/GlobalStates";
import { useDispatch } from "react-redux";

interface ChoosableObjectsPageProps {
  fromParent: string;
}

const ChoosableObjectsPage: FC<ChoosableObjectsPageProps> = ({
  fromParent,
}) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { selectedLocation } = state as { selectedLocation: Location };
  const dispatch = useDispatch();
  // const selectedLocation = useSelector((state: RootState) => state.globalStates.selectedCard);
  // const returnPath = fromParent?.startsWith("Edit-") ? "/EditUnit" : "/AddUnit";

  dispatch(setIsObjectsPage(true));
  let navigationPath: string;
  switch (fromParent) {
    case "EditUnit":
      navigationPath = "/EditUnit";
      break;
    case "Edit-EditUnit":
      navigationPath = "/Edit-EditUnit";
      break;
    case "AddUnit":
      navigationPath = "/AddUnit";
      break;
    case "Edit-AddUnit":
      navigationPath = "/Edit-AddUnit";
      break;
  }
  const handleObjectSelect = (object: ObjectLocation) => {
    navigate(navigationPath, {
      state: { selectedLocation, selectedObject: object },
    });
  };

  return (
    <div className="objects-container" dir="rtl">
      {selectedLocation.objectsList?.map((object: ObjectLocation) => (
        <div key={object.objectID} onClick={() => handleObjectSelect(object)}>
          <ChoosableObjectCard object={object} />
        </div>
      ))}
    </div>
  );
};

export default ChoosableObjectsPage;
