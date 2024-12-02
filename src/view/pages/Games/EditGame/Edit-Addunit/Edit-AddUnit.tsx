import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Location,
  ObjectLocation,
  Task,
  Unit,
} from "../../../../../redux/models/Interfaces";
import AlertMessage from "../../../../components/Common/AlertMessage/AlertMessage";
import { useDispatch } from "react-redux";
import { setUnitsInEditGame } from "../../../../../redux/slices/GlobalStates";

const AddUnitHebrew = {
  CreateNewUnit: "הוספת חוליה",
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

function safeParse(json: string) {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null;
  }
}

function EditAddUnit() {
  const [name, setName] = useState(
    localStorage.getItem("edit-addUnitName") || ""
  );
  const [description, setDescription] = useState(
    localStorage.getItem("edit-addUnitDescription") || ""
  );
  const [hint, setHint] = useState(
    localStorage.getItem("edit-addUnitHint") || ""
  );
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState<Task | null>(
    safeParse(localStorage.getItem("edit-selectedTask") || "null")
  );
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    safeParse(localStorage.getItem("edit-selectedLocation") || "null")
  );
  const [selectedObject, setSelectedObject] = useState<ObjectLocation | null>(
    safeParse(localStorage.getItem("edit-selectedObject") || "null")
  );
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    localStorage.setItem("edit-addUnitName", name);
    localStorage.setItem("edit-addUnitDescription", description);
    localStorage.setItem("edit-addUnitHint", hint);
    localStorage.setItem("edit-selectedTask", JSON.stringify(selectedTask));
    localStorage.setItem(
      "edit-selectedLocation",
      JSON.stringify(selectedLocation)
    );
    localStorage.setItem("edit-selectedObject", JSON.stringify(selectedObject));
  }, [name, description, hint, selectedTask, selectedLocation, selectedObject]);

  useEffect(() => {
    if (location.state) {
      const state = location.state;
      if (state.selectedTask) {
        setSelectedTask(state.selectedTask);
      }
      if (state.selectedLocation && state.selectedObject) {
        setSelectedLocation(state.selectedLocation);
        setSelectedObject(state.selectedObject);
      }
    }
  }, [location.state]);

  function clearLocalStorage() {
    localStorage.removeItem("edit-addUnitName");
    localStorage.removeItem("edit-addUnitDescription");
    localStorage.removeItem("edit-addUnitHint");
    localStorage.removeItem("edit-selectedTask");
    localStorage.removeItem("edit-selectedLocation");
    localStorage.removeItem("edit-selectedObject");
  }

  const handleSaveUnit = () => {
    if (!name.trim() || !hint.trim()) {
      setAlertMessage("אנא ספק שם ורמז עבור המשימה");
    } else {
      if (selectedTask && selectedObject && selectedLocation) {
        const createdUnit: Unit = {
          unitID: Math.floor(Math.random() * 10000),
          unitOrder: 0, // Will be set based on the order in the units list
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
        dispatch(setUnitsInEditGame(createdUnit));
        navigate("/EditGameUnitsPage", { state: { newUnit: createdUnit } });
        clearLocalStorage();
      } else {
        setAlertMessage("אנא בחר משימה, אובייקט ומיקום לפני שמירת הנתונים");
      }
    }
  };

  return (
    <div className="main-container-add-unit">
      {alertMessage && <AlertMessage message={alertMessage} />}
      <div className="overlay" />

      <div className="add-unit-container" dir="rtl">
        <div className="add-unit-title">{AddUnitHebrew.CreateNewUnit}</div>
        <div className="input-group">
          <label className="input-label">{AddUnitHebrew.Name}</label>
          <input
            type="text"
            className="unit-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label className="input-label">{AddUnitHebrew.Description}</label>
          <textarea
            className="unit-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="input-group">
          <label className="input-label">{AddUnitHebrew.Hint}</label>
          <textarea
            className="unit-textarea"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
          ></textarea>
        </div>
        {selectedTask && (
          <div className="input-group">
            <label className="input-label">{AddUnitHebrew.SelectedTask}</label>
            <div className="selected-task">{selectedTask.name}</div>
          </div>
        )}
        {selectedLocation && (
          <div className="input-group">
            <label className="input-label">
              {AddUnitHebrew.SelectedLocation}
            </label>
            <div className="selected-task">{selectedLocation.name}</div>
          </div>
        )}
        {selectedObject && (
          <div className="input-group">
            <label className="input-label">
              {AddUnitHebrew.SelectedObject}
            </label>
            <div className="selected-task">{selectedObject.name}</div>
          </div>
        )}
        <div className="options-container">
          <div className="option-section">
            <div className="add-buttons">
              <button
                type="button"
                className="option-button"
                onClick={() =>
                  navigate("/edit-ChooseLocation-add", {
                    state: { returnTo: "/EditAddUnit" },
                  })
                }
              >
                {AddUnitHebrew.ChooseLocation}
              </button>
              <button
                type="button"
                className="option-button"
                onClick={() =>
                  navigate("/edit-ChooseTask-add", {
                    state: { returnTo: "/EditAddUnit" },
                  })
                }
              >
                {AddUnitHebrew.ChooseTask}
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
                onClick={() => {
                  clearLocalStorage();
                  navigate("/EditGameUnitsPage");
                }}
              >
                {AddUnitHebrew.Cancel}
              </button>
              <button
                type="button"
                className="save-button"
                onClick={handleSaveUnit}
              >
                {AddUnitHebrew.Save}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditAddUnit;
