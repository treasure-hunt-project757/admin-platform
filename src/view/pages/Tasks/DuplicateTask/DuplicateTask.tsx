import React, { useState } from "react";
import "./DuplicateTask.scss";
import { UploadFileIcon } from "../../../photos";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import {
  MediaTask,
  QuestionTaskTBC,
  Task,
  TaskTBC,
} from "../../../../redux/models/Interfaces";
import { useLocation, useNavigate } from "react-router-dom";
import { taskAPI } from "../../../../redux/services/TaskApi";
import MediaViewer from "../../../components/Common/MediaViewer/MediaViewer";
import Loader from "../../../components/Common/LoadingSpinner/Loader";
import ConfirmationDialog from "../../../components/Common/ConfirmationDialog/ConfirmationDialog";
import AlertMessage from "../../../components/Common/AlertMessage/AlertMessage";

const DuplicateTaskHebrew = {
  DuplicateTask: "שכפול משימה",
  Name: "שם : ",
  Description: "תיאור : ",
  AddMedia: "הוספת מדיה : ",
  Q: "שאלה : ",
  AdditionalNotes: "הוספת טקסט",
  ToggleOnMedia: "הצג מדיה",
  ToggleOnQuestion: "הצג שאלה",
  ToggleOnNotes: "הצג טקסט",
  ToggleOffMedia: "הסתר מדיה",
  ToggleOffQuestion: "הסתר שאלה",
  ToggleOffNotes: "הסתר טקסט",
  Save: "שמירה",
  HideQuestion: "מחיקת שאלה",
  UploadFile: "הורדת קובץ",
  HideMedia: "מחיקת מדיה",
  DeleteAnswer: "מחיקת תשובה",
  Answer: "תשובה",
  HideNotes: "מחיקת הטקסט",
  AddAnswer: "הוספת תשובה",
  FreeText: "טקסט חופשי :",
  Media: "מדיה :",
  answers: "תשובות :",
  Delete_Media: "מחיקת תוכן",
  NoMedia: "אין מדיה למשימה הזאת",
  Sectors: "בחירת מחלקה",
  WithMsg: "הצגת הודעת הצלחה ",
  Cancel: "ביטול",
};

function DuplicateTask() {
  const location = useLocation();
  const taskToDuplicate = location.state?.taskToDuplicate as Task;
  const [taskName, setTaskName] = useState<string>(taskToDuplicate.name);
  const [description, setDescription] = useState<string>(
    taskToDuplicate.description || ""
  );
  const [question, setQuestion] = useState<string>(
    taskToDuplicate.questionTask?.question || ""
  );
  const [answers, setAnswers] = useState<string[]>(
    taskToDuplicate.questionTask?.answers || []
  );
  const [correctAnswer, setCorrectAnswer] = useState<number>(
    taskToDuplicate.questionTask?.correctAnswer ?? 0
  );
  const [additionalNotes, setAdditionalNotes] = useState<string>(
    taskToDuplicate.taskFreeTexts?.[0] || ""
  );
  const [showMedia, setShowMedia] = useState<boolean>(
    !!taskToDuplicate.mediaList?.length
  );
  const [showQuestion, setShowQuestion] = useState<boolean>(
    !!taskToDuplicate.questionTask
  );
  const [showNotes, setShowNotes] = useState<boolean>(
    !!taskToDuplicate.taskFreeTexts?.length
  );
  const [selectedSector, setSelectedSector] = useState<number | null>(
    taskToDuplicate.adminIDAPI || null
  );
  const [withMsg, setWithMsg] = useState<boolean>(taskToDuplicate.withMsg);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [existingMediaTasks, setExistingMediaTasks] = useState<MediaTask[]>(
    taskToDuplicate.mediaList || []
  );
  const [newMediaFiles, setNewMediaFiles] = useState<File[]>([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sectors = useSelector((state: RootState) => state.AllData.Sectors);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setNewMediaFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  const handleDeleteMedia = (index: number) => {
    if (index < existingMediaTasks.length) {
      setExistingMediaTasks((prevTasks) =>
        prevTasks.filter((_, i) => i !== index)
      );
    } else {
      const newIndex = index - existingMediaTasks.length;
      setNewMediaFiles((prevFiles) =>
        prevFiles.filter((_, i) => i !== newIndex)
      );
    }
  };

  const handleDeleteQuestion = () => {
    setShowQuestion(false);
    setQuestion("");
    setAnswers([]);
    setCorrectAnswer(0);
  };

  const handleSubmit = async () => {
    if (!taskName.trim()) {
      setAlertMessage("למשימה חייב להיות שם.");
      return;
    }
    if (
      !showQuestion &&
      !additionalNotes.trim() &&
      newMediaFiles.length === 0 &&
      existingMediaTasks.length === 0
    ) {
      setAlertMessage(
        "למשימה חייב להיות לפחות אלמנט אחד (שאלה, מדיה או הערות)."
      );
      return;
    }
    if (selectedSector === null) {
      setAlertMessage("למשימה חייב להיות תחום.");
      return;
    }

    setIsLoading(true);
    setLoadingMessage("יוצר משימה חדשה...");

    const newTask: TaskTBC = {
      name: taskName,
      description,
      taskFreeTexts: additionalNotes ? [additionalNotes] : [],
      withMsg,
    };

    const newQuestionTask: QuestionTaskTBC | null = showQuestion
      ? {
          question,
          answers,
          correctAnswer,
        }
      : null;

    const sectorAdmin =
      sectors.find((sector) => sector.adminID === selectedSector)?.sector || "";

    const existingMediaIds = existingMediaTasks.map(
      (media) => media.mediaTaskID
    );

    try {
      const duplicatedTask = await taskAPI.duplicateTask(
        newTask,
        newQuestionTask,
        newMediaFiles.length > 0 ? newMediaFiles : null,
        sectorAdmin,
        existingMediaIds.length > 0 ? existingMediaIds : null,
        taskToDuplicate.taskID
      );

      dispatch({ type: "ADD_TASK_SUCCESS", payload: duplicatedTask });
      setAlertMessage("המשימה שוכפלה בהצלחה!");
      setLoadingMessage("המשימה נוצרה בהצלחה!");
      setTimeout(() => {
        setIsLoading(false);
        setLoadingMessage("");
        navigate("/Tasks");
      }, 1000);
    } catch (error) {
      console.error("Failed to duplicate task:", error);
      setAlertMessage("שכפול המשימה נכשל.");
      setLoadingMessage("שגיאה ביצירת המשימה");
      setTimeout(() => {
        setIsLoading(false);
        setLoadingMessage("");
      }, 2000);
    }
  };

  return (
    <div className="main-container-edit-task">
      <Loader isLoading={isLoading} message={loadingMessage} />
      {alertMessage && <AlertMessage message={alertMessage} />}
      {showConfirm && (
        <ConfirmationDialog
          onConfirm={() => {
            setShowConfirm(false);
            navigate("/Tasks");
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="overlay" />
      <div className="edit-task-container" dir="rtl">
        <div className="scrollable-content">
          <div className="edit-task-title">
            {DuplicateTaskHebrew.DuplicateTask}
          </div>
          <div className="input-group">
            <label className="input-label">{DuplicateTaskHebrew.Name}</label>
            <input
              type="text"
              className="task-input"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="input-label">
              {DuplicateTaskHebrew.Description}
            </label>
            <textarea
              className="task-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          {showMedia && (
            <div className="input-group">
              <label className="input-label">
                {DuplicateTaskHebrew.AddMedia}
              </label>
              <input
                type="file"
                multiple
                accept="image/*, video/*, audio/*"
                id="file-upload"
                className="file-input"
                onChange={handleMediaChange}
                style={{ display: "none" }}
              />
              <label htmlFor="file-upload" className="file-upload-label">
                <img
                  src={UploadFileIcon}
                  alt="Upload File"
                  className="file-upload-icon"
                />
              </label>
              <MediaViewer
                mediaList={[
                  ...existingMediaTasks,
                  ...newMediaFiles.map((file, index) => ({
                    mediaTaskID: existingMediaTasks.length + index,
                    fileName: file.name,
                    mediaPath: URL.createObjectURL(file),
                    mediaType: file.type,
                    mediaUrl: URL.createObjectURL(file),
                  })),
                ]}
                onDelete={handleDeleteMedia}
                deletable={true}
              />
              <button
                type="button"
                className="delete-option-button"
                onClick={() => setShowMedia(false)}
              >
                {DuplicateTaskHebrew.HideMedia}
              </button>
            </div>
          )}
          {showQuestion && (
            <div className="input-group">
              <label className="input-label">{DuplicateTaskHebrew.Q}</label>
              <input
                type="text"
                className="task-input"
                placeholder="הוספת שאלה"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="answer-container">
                  <input
                    type="text"
                    className="task-input"
                    value={answers[index] || ""}
                    onChange={(e) => {
                      const newAnswers = [...answers];
                      newAnswers[index] = e.target.value;
                      setAnswers(newAnswers);
                    }}
                    placeholder={`${DuplicateTaskHebrew.Answer} ${index + 1}`}
                  />
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={correctAnswer === index}
                    onChange={() => setCorrectAnswer(index)}
                  />
                </div>
              ))}
              <button
                type="button"
                className="delete-option-button"
                onClick={handleDeleteQuestion}
              >
                {DuplicateTaskHebrew.HideQuestion}
              </button>
            </div>
          )}
          {showNotes && (
            <div className="input-group">
              <label className="input-label">
                {DuplicateTaskHebrew.AdditionalNotes}
              </label>
              <textarea
                className="task-textarea"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
              ></textarea>
              <button
                type="button"
                className="delete-option-button"
                onClick={() => setShowNotes(false)}
              >
                {DuplicateTaskHebrew.HideNotes}
              </button>
            </div>
          )}
          <div className="edit-buttons">
            <button
              type="button"
              className="option-button"
              onClick={() => setShowMedia(!showMedia)}
            >
              {showMedia
                ? DuplicateTaskHebrew.ToggleOffMedia
                : DuplicateTaskHebrew.ToggleOnMedia}
            </button>
            <button
              type="button"
              className="option-button"
              onClick={() => setShowQuestion(!showQuestion)}
            >
              {showQuestion
                ? DuplicateTaskHebrew.ToggleOffQuestion
                : DuplicateTaskHebrew.ToggleOnQuestion}
            </button>
            <button
              type="button"
              className="option-button"
              onClick={() => setShowNotes(!showNotes)}
            >
              {showNotes
                ? DuplicateTaskHebrew.ToggleOffNotes
                : DuplicateTaskHebrew.ToggleOnNotes}
            </button>
          </div>
          <div className="input-group">
            <label className="input-label">{DuplicateTaskHebrew.Sectors}</label>
            <select
              value={selectedSector ?? ""}
              onChange={(e) => setSelectedSector(Number(e.target.value))}
              className="task-input"
            >
              <option value="" disabled hidden>
                {DuplicateTaskHebrew.Sectors}
              </option>
              {sectors.map((sector, index) => (
                <option key={index} value={sector.adminID}>
                  {sector.sector}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group input-group-checkbox">
            <input
              type="checkbox"
              checked={withMsg}
              onChange={(e) => setWithMsg(e.target.checked)}
            />
            <label className="checkbox-label">
              {DuplicateTaskHebrew.WithMsg}
            </label>
          </div>
          <div className="buttons">
            <button className="save-button" onClick={handleSubmit}>
              {DuplicateTaskHebrew.Save}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setShowConfirm(true)}
            >
              {DuplicateTaskHebrew.Cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DuplicateTask;
