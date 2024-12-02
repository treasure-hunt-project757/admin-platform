import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import {
  Game,
  Location,
  ObjectLocation,
  Task,
  Unit,
} from "../../../../../redux/models/Interfaces";
import AlertMessage from "../../../../components/Common/AlertMessage/AlertMessage";
import {
  setCard,
  setIsAddUnitPageFlag,
  setIsEditing,
  setIsEditUnitPage,
  updateSpecificUnit,
} from "../../../../../redux/slices/GlobalStates";

const EditUnitHebrew = {
  EditUnit: "עריכת חוליה",
  Name: "שם : ",
  Description: "תיאור : ",
  Hint: "רמז:",
  SelectedTask: "משימה לחוליה: ",
  SelectedLocation: "מקום לחוליה: ",
  SelectedObject: "אובייקט לחוליה: ",
  ChooseLocation: "בחירת אובייקט",
  ChooseTask: "בחירת משימה",
  Save: "שמירה",
  Cancel: "ביטול",
};

function safeParse<T>(json: string | null): T | null {
  if (json === null) return null;
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null;
  }
}

function EditEditUnit() {
  const [unitID, setUnitID] = useState<number | null>(null);
  const [unitOrder, setUnitOrder] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hint, setHint] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const dispatch = useDispatch();

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [selectedObject, setSelectedObject] = useState<ObjectLocation | null>(
    null
  );

  const navigate = useNavigate();
  const location = useLocation();
  const locations = useSelector((state: RootState) => state.AllData.locations);
  const tasks = useSelector((state: RootState) => state.AllData.Tasks);
  const game: Game = useSelector(
    (state: RootState) => state.globalStates.selectedCard
  );

  useEffect(() => {
    dispatch(setIsEditUnitPage(true));
    dispatch(setIsEditing(false));
    dispatch(setIsAddUnitPageFlag(false));
    const unit: Unit =
      location.state?.unit || safeParse(localStorage.getItem("edit-editUnit"));

    if (unit) {
      setUnitID(unit.unitID);
      setUnitOrder(unit.unitOrder);
      setName(unit.name);
      setDescription(unit.description || "");
      setHint(unit.hint);

      if (unit.taskDTO) {
        setSelectedTask(unit.taskDTO);
      } else if (unit.taskID) {
        const task = tasks.find((t: Task) => t.taskID === unit.taskID);
        setSelectedTask(task || null);
      }

      if (unit.locationDTO) {
        setSelectedLocation(unit.locationDTO);
      } else if (unit.locationID) {
        const loc = locations.find(
          (l: Location) => l.locationID === unit.locationID
        );
        setSelectedLocation(loc || null);
      }

      if (unit.objectDTO) {
        setSelectedObject(unit.objectDTO);
      } else if (unit.objectID) {
        const loc =
          unit.locationDTO ||
          locations.find((l: Location) => l.locationID === unit.locationID);
        const object = loc?.objectsList?.find(
          (o: ObjectLocation) => o.objectID === unit.objectID
        );
        setSelectedObject(object || null);
      }

      updateLocalStorage(unit);
    }
  }, [location.state?.unit, tasks, locations]);

  useEffect(() => {
    if (location.state) {
      const { selectedTask, selectedLocation, selectedObject } = location.state;
      if (selectedTask) setSelectedTask(selectedTask);
      if (selectedLocation) setSelectedLocation(selectedLocation);
      if (selectedObject) setSelectedObject(selectedObject);
    }
  }, [location.state]);

  function updateLocalStorage(data: Partial<Unit>) {
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(`edit-${key}`, JSON.stringify(value));
    });
  }

  function clearLocalStorage() {
    [
      "edit-editUnit",
      "edit-editUnitID",
      "edit-editUnitOrder",
      "edit-editUnitName",
      "edit-editUnitDescription",
      "edit-editUnitHint",
      "edit-selectedTask",
      "edit-selectedLocation",
      "edit-selectedObject",
    ].forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  const handleSaveUnit = () => {
    if (!name.trim() || !hint.trim()) {
      setAlertMessage("אנא ספק שם ורמז עבור המשימה");
      return;
    }
    if (!(selectedTask && selectedObject && selectedLocation)) {
      setAlertMessage("אנא בחר משימה, אובייקט ומיקום לפני שמירת הנתונים");
      return;
    }

    const updatedUnit: Unit = {
      unitID: unitID!,
      unitOrder: unitOrder!,
      name,
      description,
      hint,
      taskID: selectedTask.taskID,
      objectID: selectedObject.objectID,
      locationID: selectedLocation.locationID,
      taskDTO: selectedTask,
      objectDTO: selectedObject,
      locationDTO: selectedLocation,
    };

    const updatedGame = { ...game };
    updatedGame.units =
      updatedGame.units?.map((u) =>
        u.unitID === updatedUnit.unitID ? updatedUnit : u
      ) || [];

    dispatch(setCard(updatedGame));
    dispatch(
      updateSpecificUnit({
        id: updatedUnit.unitID,
        updatedUnit: updatedUnit as Unit,
      })
    );
    navigate("/EditGameUnitsPage", { state: { game: updatedGame } });
    clearLocalStorage();
  };

  const handleChooseLocation = () => {
    const unitToSave = {
      unitID,
      unitOrder,
      name,
      description,
      hint,
      taskID: selectedTask?.taskID,
      objectID: selectedObject?.objectID,
      locationID: selectedLocation?.locationID,
    };
    localStorage.setItem("edit-editUnit", JSON.stringify(unitToSave));

    dispatch(
      updateSpecificUnit({
        id: unitToSave.unitID!,
        updatedUnit: unitToSave as Unit,
      })
    );

    navigate("/edit-ChooseLocation-edit");
  };

  const handleChooseTask = () => {
    const unitToSave = {
      unitID,
      unitOrder,
      name,
      description,
      hint,
      taskID: selectedTask?.taskID,
      objectID: selectedObject?.objectID,
      locationID: selectedLocation?.locationID,
    };

    localStorage.setItem("edit-editUnit", JSON.stringify(unitToSave));

    dispatch(
      updateSpecificUnit({
        id: unitToSave.unitID!,
        updatedUnit: unitToSave as Unit,
      })
    );

    navigate("/edit-ChooseTask-edit");
  };

  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  return (
    <div className="main-container-edit-unit">
      {alertMessage && <AlertMessage message={alertMessage} />}
      <div className="overlay" />
      <div className="edit-unit-container" dir="rtl">
        <div className="edit-unit-title">{EditUnitHebrew.EditUnit}</div>
        <div className="input-group">
          <label className="input-label">{EditUnitHebrew.Name}</label>
          <input
            type="text"
            className="unit-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label className="input-label">{EditUnitHebrew.Description}</label>
          <textarea
            className="unit-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="input-group">
          <label className="input-label">{EditUnitHebrew.Hint}</label>
          <textarea
            className="unit-textarea"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
          ></textarea>
        </div>
        {selectedTask && (
          <div className="input-group">
            <label className="input-label">{EditUnitHebrew.SelectedTask}</label>
            <div className="selected-task">{selectedTask.name}</div>
          </div>
        )}
        {selectedLocation && (
          <div className="input-group">
            <label className="input-label">
              {EditUnitHebrew.SelectedLocation}
            </label>
            <div className="selected-task">{selectedLocation.name}</div>
          </div>
        )}
        {selectedObject && (
          <div className="input-group">
            <label className="input-label">
              {EditUnitHebrew.SelectedObject}
            </label>
            <div className="selected-task">{selectedObject.name}</div>
          </div>
        )}
        <div className="options-container">
          <div className="option-section">
            <div className="unit-buttons">
              <button
                type="button"
                className="option-button"
                onClick={handleChooseLocation}
              >
                {EditUnitHebrew.ChooseLocation}
              </button>
              <button
                type="button"
                className="option-button"
                onClick={handleChooseTask}
              >
                {EditUnitHebrew.ChooseTask}
              </button>
            </div>
          </div>
        </div>
        <div className="options-container">
          <div className="option-section">
            <div className="button-group">
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate("/EditGameUnitsPage")}
              >
                {EditUnitHebrew.Cancel}
              </button>
              <button
                type="button"
                className="save-button"
                onClick={handleSaveUnit}
              >
                {EditUnitHebrew.Save}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditEditUnit;
