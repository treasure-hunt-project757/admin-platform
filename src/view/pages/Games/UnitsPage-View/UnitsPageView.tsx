import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { Game, Unit } from "../../../../redux/models/Interfaces";
import { useNavigate } from "react-router-dom";
import "./UnitsPage-View.scss";

const UnitsPageHeb = {
  Units: "חוליות",
};

const UnitsPageView: React.FC = () => {
  const game: Game = useSelector(
    (state: RootState) => state.globalStates.selectedCard
  );
  const navigate = useNavigate();

  const handleView = (unit: Unit) => {
    navigate("/UnitDetailsView", { state: { unit } });
  };

  return (
    <div className="main-container-units">
      <div className="overlay" />
      <div className="units-container" dir="rtl">
        <div className="units-title">{UnitsPageHeb.Units}</div>
        <div className="units-list">
          {game.units?.map((unit) => (
            <div
              key={unit.unitID}
              className="unit-card"
              onClick={() => handleView(unit)}
              title={unit.hint}
            >
              <div className="unit-name">{unit.name}</div>
              {unit.description && (
                <div className="unit-description">{unit.description}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnitsPageView;
