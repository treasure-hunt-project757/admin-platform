import { FC, useEffect, useState } from "react";
import ChoosableLocationCard from "./ChooseLocationCard";
import { locationAPI } from "../../../../../redux/services/LocationApi";
import HomePage from "../../../../components/Common/HomePage/HomePage";
// import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { setLocations } from "../../../../../redux/slices/saveAllData";
// import './LocationPage.scss';

// import './ChoosableLocationPage.scss';
interface ChoosableLocationPageProps {
  fromParent: string;
}
const ChoosableLocationPage: FC<ChoosableLocationPageProps> = ({
  fromParent,
}) => {
  // const [locations, setLocations] = useState<Location[]>([]);
  // const navigate = useNavigate();
  const locations = useSelector((state: RootState) => state.AllData.locations);
  const [alertMessage, setAlertMessage] = useState<string>();

  useEffect(() => {
    const fetchLocations = async () => {
      const fetchedLocations = await locationAPI.getAllLocations();
      setLocations(fetchedLocations);
    };
    fetchLocations();
  }, []);
  // const navigationPath = fromParent === "EditUnit" ? "/EditUnit" : "/AddUnit";
  // const navigationPath = fromParent?.startsWith("Edit-") ? "/EditUnit" : "/AddUnit";
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

  // const handleLocationSelect = (location: Location) => {
  //     navigate(`/ChoosableObjectsPage`, { state: { selectedLocation: location } });
  // };

  return (
    <HomePage
      objects={locations}
      page="ChooseLocation"
      Component={(props) => (
        <ChoosableLocationCard
          {...props}
          setAlertMessage={setAlertMessage}
          navigationPath={navigationPath}
        />
      )}
      setCardOnClick={false}
      alertMessage={alertMessage}
    />

    // <div className="locations-container">
    //     {locations.map(location => (
    //         <div key={location.locationID}>
    //             <ChoosableLocationCard object={location} />
    //         </div>
    //     ))}
    // </div>
  );
};

export default ChoosableLocationPage;
