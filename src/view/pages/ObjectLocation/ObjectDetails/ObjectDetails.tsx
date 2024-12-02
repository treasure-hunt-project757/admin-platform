import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import "./ObjectDetails.scss";
import { ObjectImage, Game } from "../../../../redux/models/Interfaces";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Common/LoadingSpinner/Loader";
import AlertMessage from "../../../components/Common/AlertMessage/AlertMessage";
import { gameAPI } from "../../../../redux/services/GameApi";

const ObjectDetailsHebrew = {
  Name: "שם",
  Description: "תיאור : ",
  Object_Imgs: "תמונות",
  ImagesNumber: "מספר תמונות: ",
  NoImagesAvailable: "אין תמונות",
  ViewGames: "צפייה במשחקים",
};

const ObjectDetails: React.FC = () => {
  const navigate = useNavigate();
  const object = useSelector(
    (state: RootState) => state.globalStates.selectedCard
  );
  const objectImages = object?.objectImages ?? [];

  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch the games for the object when the component mounts
  useEffect(() => {
    const fetchGamesForObject = async () => {
      if (object?.objectID) {
        setIsLoading(true);
        try {
          const fetchedGames = await gameAPI.getGamesForObject(object.objectID);
          setGames(fetchedGames);
        } catch (error) {
          setErrorMessage("Failed to load games.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchGamesForObject();
  }, [object?.objectID]);

  const handleViewGames = () => {
    if (games.length > 0) {
      navigate("/ObjectGames", { state: { games } });
    }
  };

  return (
    <div className="object-container" dir="rtl">
      <div className="overlay" />
      <div className="object-details">
        <div className="object-title">{object?.name}</div>
        {object?.description && (
          <div className="object-description">
            <div className="description-title">
              {ObjectDetailsHebrew.Description}
            </div>
            <div className="description">{object.description}</div>
          </div>
        )}
        <div className="task-content">
          {isLoading && <Loader isLoading={true} message="Loading games..." />}
          {errorMessage && <AlertMessage message={errorMessage} />}
          {games.length > 0 && (
            <button className="view-games-button" onClick={handleViewGames}>
              {ObjectDetailsHebrew.ViewGames}
            </button>
          )}
          <div className="object-imgs-list">
            <div className="section-title">
              {ObjectDetailsHebrew.Object_Imgs}
            </div>
            <div className="image-count">
              {ObjectDetailsHebrew.ImagesNumber}
              {objectImages.length}
            </div>
            {objectImages.length > 0 ? (
              <div className="image-grid">
                {objectImages.map((img: ObjectImage) => (
                  <img
                    key={img.id}
                    className="img-media"
                    src={img.imageUrl}
                    alt={img.name}
                  />
                ))}
              </div>
            ) : (
              <div>{ObjectDetailsHebrew.NoImagesAvailable}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectDetails;
