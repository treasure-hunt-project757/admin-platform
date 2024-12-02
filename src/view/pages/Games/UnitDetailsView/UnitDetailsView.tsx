import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCard } from "../../../../redux/slices/GlobalStates";
import "./UnitDetailsView.scss";
import { Unit } from "../../../../redux/models/Interfaces";

const UnitDetailsHebrew = {
  UnitDetails: "פרטי החוליה",
  Name: "שם : ",
  Description: "תיאור : ",
  Hint: "רמז:",
  Task: "משימה לחוליה: ",
  Location: "מקום לחוליה: ",
  Object: "אובייקט לחוליה: ",
  Back: "חזרה",
};

const UnitDetailsView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const unit: Unit = location.state.unit;

  const handleSetCard = (ob: any) => {
    dispatch(setCard(ob));
  };

  return (
    <div className="main-container-unit-details">
      <div className="overlay"></div>
      <div className="unit-details-container" dir="rtl">
        <div className="unit-details-title">
          {UnitDetailsHebrew.UnitDetails}
        </div>
        <div className="input-group">
          <label className="input-label">{UnitDetailsHebrew.Name}</label>
          <div className="unit-value">{unit.name}</div>
        </div>
        <div className="input-group">
          <label className="input-label">{UnitDetailsHebrew.Description}</label>
          <div className="unit-value">{unit.description}</div>
        </div>
        <div className="input-group">
          <label className="input-label">{UnitDetailsHebrew.Hint}</label>
          <div className="unit-value">{unit.hint}</div>
        </div>
        <div className="input-group">
          <label className="input-label">{UnitDetailsHebrew.Task}</label>
          <Link
            to={`/TaskDetails/${encodeURIComponent(unit.taskDTO?.name || "")}`}
            className="link"
            onClick={() => handleSetCard(unit.taskDTO)}
          >
            <div
              className="unit-value"
              style={{ cursor: "pointer", color: "blue" }}
            >
              {unit.taskDTO?.name}
            </div>
          </Link>
        </div>
        <div className="input-group">
          <label className="input-label">{UnitDetailsHebrew.Location}</label>
          <Link
            to={`/LocationDetails/${encodeURIComponent(
              unit.locationDTO?.name || ""
            )}`}
            className="link"
            onClick={() => handleSetCard(unit.locationDTO)}
          >
            <div
              className="unit-value"
              style={{ cursor: "pointer", color: "blue" }}
            >
              {unit.locationDTO?.name}
            </div>
          </Link>
        </div>
        <div className="input-group">
          <label className="input-label">{UnitDetailsHebrew.Object}</label>
          <Link
            to={`/ObjectDetails/${encodeURIComponent(
              unit.objectDTO?.name || ""
            )}`}
            className="link"
            onClick={() => handleSetCard(unit.objectDTO)}
          >
            <div
              className="unit-value"
              style={{ cursor: "pointer", color: "blue" }}
            >
              {unit.objectDTO?.name}
            </div>
          </Link>
        </div>
        <button className="back-button" onClick={() => navigate(-1)}>
          {UnitDetailsHebrew.Back}
        </button>
      </div>
    </div>
  );
};

export default UnitDetailsView;
