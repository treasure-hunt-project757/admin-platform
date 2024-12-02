import React, { useEffect, useState } from "react";
import "./AddTask.scss";
import { UploadFileIcon } from "../../../photos";
import {
  Admin,
  MediaTaskTBC,
  QuestionTask,
  TaskTBC,
  UserRole,
} from "../../../../redux/models/Interfaces";
import { taskAPI } from "../../../../redux/services/TaskApi";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";
import MediaViewer from "../../../components/Common/MediaViewer/MediaViewer";
import { CiCircleInfo } from "react-icons/ci";
import Loader from "../../../components/Common/LoadingSpinner/Loader";
import AlertMessage from "../../../components/Common/AlertMessage/AlertMessage";

const AddNewTaskHebrew = {
  CreateNewTask: "הוספת משימה חדשה",
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
  Delete_Media: "מחיקה",
  WithMsg: "הצגת הודעת הצלחה ",
  Sectors: "בחירת מחלקה",
  infoMessage: "הוספת טקסט קצר",
  infoMediaMessage: "הוספת וידאו, אודיו או תמונה",
  infoAboutChoosingSector: "יש לבחור תחום למשימה",
  MaxCharactersAlert: "אפשר להקליד עד 45 תווים בלבד.",
};

function AddTask() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [question, setQuestion] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [showMedia, setShowMedia] = useState<boolean>(false);
  const [showQuestion, setShowQuestion] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [mediaFiles, setMediaFiles] = useState<MediaTaskTBC[]>([]);
  const sectors = useSelector((state: RootState) => state.AllData.Sectors);
  const CreateGame = useSelector(
    (state: RootState) => state.globalStates.isCreateGame
  );
  const [withMsg, setWithMsg] = useState<boolean>(true);
  const adminStr = localStorage.getItem("admin");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const admin: Admin = adminStr
    ? {
        ...JSON.parse(adminStr),
        role: UserRole[JSON.parse(adminStr).role as keyof typeof UserRole],
      }
    : null;
  const [selectedSector, setSelectedSector] = useState<number | null>(
    admin.role === UserRole.SectorAdmin ? admin.adminID : null
  );
  const [visibleInfo, setVisibleInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  useEffect(() => {
    return () => {
      mediaFiles.forEach((file) => URL.revokeObjectURL(file.mediaPath));
    };
  }, [mediaFiles]);

  const handleInfoClick = (info: string) => {
    setVisibleInfo((prev) => (prev === info ? null : info));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newMediaTasks: MediaTaskTBC[] = Array.from(selectedFiles).map(
        (file) => ({
          fileName: file.name,
          mediaPath: URL.createObjectURL(file),
          mediaType: file.type,
          file: file,
        })
      );

      const hasImage = newMediaTasks.some((file) =>
        file.mediaType.includes("image")
      );
      const hasVideo = newMediaTasks.some((file) =>
        file.mediaType.includes("video")
      );

      if (hasImage && hasVideo) {
        setAlertMessage("You cannot upload both images and videos together.");
        return;
      }

      setMediaFiles((prevFiles) => [...prevFiles, ...newMediaTasks]);
      event.target.value = "";
    }
  };
  const handleDeleteMedia = (index: number) => {
    setMediaFiles((files) => {
      const newFiles = [...files];
      const deletedFile = newFiles.splice(index, 1)[0];

      if (deletedFile && deletedFile.mediaPath) {
        URL.revokeObjectURL(deletedFile.mediaPath);
      }

      return newFiles;
    });
  };

  function validateQuestion(): boolean {
    if (!question.trim() || answers.length < 1) {
      return false;
    }
    if (correctAnswer === null) {
      setAlertMessage("צריך לבחור תשובה נכונה");
      return false;
    }
    return true;
  }

  const validateAndSave = async () => {
    if (!name.trim()) {
      setAlertMessage("למשימה חייב להיות שם.");
      return;
    } else if (selectedSector === null) {
      setAlertMessage("למשימה חייב להיות תחום.");
      return;
    }
    if (question) {
      if (!validateQuestion()) {
        return;
      }
    }
    if (
      !validateQuestion() &&
      mediaFiles.length === 0 &&
      !additionalNotes.trim()
    ) {
      setAlertMessage(
        "למשימה חייב להיות לפחות אלמנט אחד (שאלה, מדיה או הערות)."
      );
      return;
    }
    if (
      !validateQuestion() &&
      mediaFiles.length === 0 &&
      !additionalNotes.trim()
    ) {
      setAlertMessage(
        "למשימה חייב להיות לפחות אלמנט אחד (שאלה, מדיה או הערות)."
      );
      return;
    } else {
      const task: TaskTBC = {
        name,
        description,
        taskFreeTexts: additionalNotes ? [additionalNotes] : [],
        withMsg,
      };

      const questionTask: QuestionTask | undefined = showQuestion
        ? {
            questionTaskID: 0,
            question,
            answers,
            correctAnswer: correctAnswer ?? 0,
            taskID: 0,
          }
        : undefined;
      setIsLoading(true);
      setLoadingMessage("שומר משימה ...");
      const formData = new FormData();
      formData.append(
        "task",
        new Blob([JSON.stringify(task)], { type: "application/json" })
      );
      if (questionTask) {
        formData.append(
          "question",
          new Blob([JSON.stringify(questionTask)], { type: "application/json" })
        );
      }
      const selectedSectorName =
        sectors.find((sector) => sector.adminID === selectedSector)?.sector ||
        "";
      formData.append("admin", selectedSectorName);

      mediaFiles.forEach((mediaFile) => {
        formData.append(`media`, mediaFile.file, mediaFile.fileName);
      });

      try {
        await taskAPI.createTask(formData);
        setLoadingMessage("המשימה נשמרה בהצלחה!");
        setTimeout(() => {
          setIsLoading(false);
          setLoadingMessage("");
          if (CreateGame) {
            navigate("/ChooseTask-add");
          } else {
            navigate("/Tasks");
          }
        }, 1000);
      } catch (error) {
        console.error("Failed to create task", error);
        setLoadingMessage("שגיאה בשמירת המשימה");
        setTimeout(() => {
          setIsLoading(false);
          setLoadingMessage("");
        }, 2000);
      }
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    if (value.length > 45) {
      const truncatedValue = value.slice(0, 45);
      const newAnswers = [...answers];
      newAnswers[index] = truncatedValue;
      setAnswers(newAnswers);
      setAlertMessage(AddNewTaskHebrew.MaxCharactersAlert);
    } else {
      setAlertMessage(null);
      const newAnswers = [...answers];
      newAnswers[index] = value;
      setAnswers(newAnswers);
    }
  };

  return (
    <div className="main-container-add-task">
      <Loader isLoading={isLoading} message={loadingMessage} />
      {alertMessage && <AlertMessage message={alertMessage} />}
      <div className="add-task-header"></div>
      <div className="overlay" />
      <div className="add-task-container" dir="rtl">
        <div className="scrollable-content">
          <div className="add-task-title">{AddNewTaskHebrew.CreateNewTask}</div>
          <div className="input-group">
            <label className="input-label">{AddNewTaskHebrew.Name}</label>
            <div className="info-icon-container">
              <input
                type="text"
                className="task-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <CiCircleInfo
                className="info-icon"
                onClick={() => handleInfoClick("name")}
              />

              {visibleInfo === "name" && (
                <div className="info-box">{AddNewTaskHebrew.infoMessage}</div>
              )}
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">
              {AddNewTaskHebrew.Description}
            </label>
            <div className="info-icon-container">
              <textarea
                className="task-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <CiCircleInfo
                className="info-icon"
                onClick={() => handleInfoClick("description")}
              />

              {visibleInfo === "description" && (
                <div className="info-box">{AddNewTaskHebrew.infoMessage}</div>
              )}
            </div>
          </div>

          <div className="options-container">
            <div className="option-section">
              {showMedia && (
                <div className="input-group">
                  <label className="input-label">
                    {AddNewTaskHebrew.AddMedia}
                  </label>
                  <div className="info-icon-container">
                    <input
                      type="file"
                      multiple
                      accept="image/*, video/*, audio/*"
                      id="file-upload"
                      className="file-input"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <label htmlFor="file-upload" className="file-upload-label">
                      <img
                        src={UploadFileIcon}
                        alt="Upload File"
                        className="file-upload-icon"
                      />
                    </label>
                    <CiCircleInfo
                      className="info-icon"
                      onClick={() => handleInfoClick("media")}
                    />

                    {visibleInfo === "media" && (
                      <div className="info-box">
                        {AddNewTaskHebrew.infoMediaMessage}
                      </div>
                    )}
                  </div>
                  {mediaFiles.length > 0 && (
                    <MediaViewer
                      mediaList={mediaFiles.map((file, index) => ({
                        key: index,
                        mediaTaskID: Math.random(),
                        fileName: file.fileName,
                        mediaPath: file.mediaPath,
                        mediaType: file.mediaType,
                        mediaUrl: file.mediaPath,
                        file: file.file,
                      }))}
                      onDelete={handleDeleteMedia}
                      deletable={true}
                      maxMediaCount={6}
                      onUploadRestricted={(message) => setAlertMessage(message)}
                    />
                  )}

                  <button
                    type="button"
                    className="delete-option-button"
                    onClick={() => setShowMedia(false)}
                  >
                    {AddNewTaskHebrew.HideMedia}
                  </button>
                </div>
              )}
              {showQuestion && (
                <div className="input-group">
                  <label className="input-label">{AddNewTaskHebrew.Q}</label>
                  <div className="info-icon-container">
                    <input
                      type="text"
                      className="task-input"
                      placeholder="הוספת שאלה"
                      value={question}
                      onChange={(e) => {
                        setQuestion(e.target.value);
                      }}
                    />
                    <CiCircleInfo
                      className="info-icon"
                      onClick={() => handleInfoClick("question")}
                    />

                    {visibleInfo === "question" && (
                      <div className="info-box">
                        {AddNewTaskHebrew.infoMessage}
                      </div>
                    )}
                  </div>
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
                          handleAnswerChange(index, e.target.value);
                        }}
                        placeholder={`${AddNewTaskHebrew.Answer} ${index + 1}`}
                      />
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={correctAnswer === index}
                        onChange={() => setCorrectAnswer(index)}
                      />
                      <div className="note-text">
                        {answers[index]?.length || 0}/45 תווים (מקסימום)
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="delete-option-button"
                    onClick={() => setShowQuestion(false)}
                  >
                    {AddNewTaskHebrew.HideQuestion}
                  </button>
                </div>
              )}

              {showNotes && (
                <div className="input-group">
                  <label className="input-label">
                    {AddNewTaskHebrew.AdditionalNotes}
                  </label>
                  <div className="info-icon-container">
                    <textarea
                      className="task-textarea"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                    ></textarea>
                    <CiCircleInfo
                      className="info-icon"
                      onClick={() => handleInfoClick("notes")}
                    />

                    {visibleInfo === "notes" && (
                      <div className="info-box">
                        {AddNewTaskHebrew.infoMessage}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="delete-option-button"
                    onClick={() => setShowNotes(false)}
                  >
                    {AddNewTaskHebrew.HideNotes}
                  </button>
                </div>
              )}
              <div className="add-buttons">
                <button
                  type="button"
                  className="option-button"
                  onClick={() => setShowMedia(!showMedia)}
                >
                  {showMedia
                    ? AddNewTaskHebrew.ToggleOffMedia
                    : AddNewTaskHebrew.ToggleOnMedia}
                </button>
                <button
                  type="button"
                  className="option-button"
                  onClick={() => setShowQuestion(!showQuestion)}
                >
                  {showQuestion
                    ? AddNewTaskHebrew.ToggleOffQuestion
                    : AddNewTaskHebrew.ToggleOnQuestion}
                </button>
                <button
                  type="button"
                  className="option-button"
                  onClick={() => setShowNotes(!showNotes)}
                >
                  {showNotes
                    ? AddNewTaskHebrew.ToggleOffNotes
                    : AddNewTaskHebrew.ToggleOnNotes}
                </button>
              </div>

              <div className="input-group">
                <label className="input-label">
                  {AddNewTaskHebrew.Sectors}
                </label>
                <div className="info-icon-container">
                  <select
                    value={selectedSector ?? ""}
                    onChange={(e) => setSelectedSector(Number(e.target.value))}
                    className="task-input"
                    disabled={admin.role === UserRole.SectorAdmin}
                  >
                    <option value="" disabled hidden>
                      {AddNewTaskHebrew.Sectors}
                    </option>
                    {sectors.map((sector, index) => (
                      <option key={index} value={sector.adminID}>
                        {sector.sector}
                      </option>
                    ))}
                  </select>
                  <CiCircleInfo
                    className="info-icon"
                    onClick={() => handleInfoClick("sectors")}
                  />

                  {visibleInfo === "sectors" && (
                    <div className="info-box">
                      {AddNewTaskHebrew.infoAboutChoosingSector}
                    </div>
                  )}
                </div>
              </div>
              <div className="input-group input-group-checkbox">
                <input
                  type="checkbox"
                  checked={withMsg}
                  onChange={(e) => setWithMsg(e.target.checked)}
                />
                <label className="checkbox-label">
                  {AddNewTaskHebrew.WithMsg}
                </label>
              </div>
            </div>
          </div>

          <button className="save-task-button" onClick={validateAndSave}>
            {AddNewTaskHebrew.Save}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTask;
