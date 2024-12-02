import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditGameUnitsPage.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import {
  deleteUnitInEditGame,
  setUnitsInEditGame,
  setUnitsInEditGameOrder,
} from "../../../../../redux/slices/GlobalStates";
import { Unit } from "../../../../../redux/models/Interfaces";

const EditGameUnitsPageHeb = {
  Units: "חוליות",
  AddUnit: "הוספת חוליה",
  Duplicate: "שכפול",
  Delete: "מחיקה",
  Save: "שמירה",
  NoUnits: "אין חוליות נוספות להצגה",
};

function EditGameUnitsPage() {
  const navigate = useNavigate();
  const [tempUnitId, setTempUnitId] = useState<number>(0);
  const dispatch = useDispatch();
  const units = useSelector(
    (state: RootState) => state.globalStates.unitsInEditGame
  );

  const handleSave = () => {
    navigate("/EditGame");
  };

  const handleDelete = (index: number) => {
    dispatch(deleteUnitInEditGame(index));
  };

  const handleDuplicate = (unit: Unit) => {
    const newUnit = {
      ...unit,
      unitID: tempUnitId,
      unitOrder: units.length + 1,
    };
    dispatch(setUnitsInEditGame(newUnit));
    setTempUnitId((prevId) => prevId + 1);
  };

  const handleDrag = (fromIndex: number, toIndex: number) => {
    console.log(`Drag from ${fromIndex} to ${toIndex}`);
    dispatch(setUnitsInEditGameOrder({ fromIndex, toIndex }));
  };

  const handleEdit = (unit: Unit) => {
    navigate("/Edit-EditUnit", { state: { unit } });
  };

  const handleAddUnit = () => {
    navigate("/Edit-AddUnit");
  };

  return (
    <div className="main-container">
      <div className="overlay" />
      <div className="units-container" dir="rtl">
        <div className="units-title">{EditGameUnitsPageHeb.Units}</div>
        <div className="units-list">
          {units.length === 0 ? (
            <div className="unit-card">
              <div className="empty-state">{EditGameUnitsPageHeb.NoUnits}</div>
            </div>
          ) : (
            units.map((unit, index) => (
              <div
                key={unit.unitID}
                className="unit-card"
                onClick={() => handleEdit(unit)}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("fromIndex", index.toString());
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const fromIndex = parseInt(
                    e.dataTransfer.getData("fromIndex"),
                    10
                  );
                  const toIndex = index;
                  if (!isNaN(fromIndex) && !isNaN(toIndex)) {
                    handleDrag(fromIndex, toIndex);
                  }
                }}
                title={unit.hint}
              >
                <div className="unit-name">{unit.name}</div>
                {unit.description && (
                  <div className="unit-description">{unit.description}</div>
                )}
                <div className="unit-actions">
                  <button
                    className="duplicate-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicate(unit);
                    }}
                  >
                    {EditGameUnitsPageHeb.Duplicate}
                  </button>
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(index);
                    }}
                  >
                    {EditGameUnitsPageHeb.Delete}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="options-container">
          <div className="option-section">
            <div className="add-buttons">
              <button
                type="button"
                className="option-button"
                onClick={handleAddUnit}
              >
                {EditGameUnitsPageHeb.AddUnit}
              </button>
            </div>
          </div>
        </div>
        <button className="save-button" onClick={handleSave}>
          {EditGameUnitsPageHeb.Save}
        </button>
      </div>
    </div>
  );
}

export default EditGameUnitsPage;
