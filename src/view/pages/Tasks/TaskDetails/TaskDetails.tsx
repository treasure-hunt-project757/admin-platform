import React from "react";
import "./TaskDetails.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { Task } from "../../../../redux/models/Interfaces";
import MediaViewer from "../../../components/Common/MediaViewer/MediaViewer";

const TaskDetailsHebrew = {
  Description: "תיאור : ",
  FreeText: "טקסט חופשי :",
  Q: "שאלה : ",
  Media: "מדיה :",
  answers: "תשובות :",
  sector: "מחלקה",
  withMsg: "הצגת הודעת הצלחה",
  noMsg: "ללא הצגת הודעת הצלחה",
};

const TaskDetails: React.FC = () => {
  const task: Task = useSelector(
    (state: RootState) => state.globalStates.selectedCard
  );
  const sectors = useSelector((state: RootState) => state.AllData.Sectors);
  const sectorName = sectors.find(
    (sector) => sector.adminID === task.adminIDAPI
  )?.sector;
  console.log("sector name", sectorName);

  return (
    <div className="task-container" dir="rtl">
      <div className="overlay" />
      <div className="task-details">
        <div className="task-title">{task.name}</div>
        <div className="task-content">
          {task.description && (
            <>
              <div className="section-title">
                {TaskDetailsHebrew.Description}
              </div>
              <div className="task-desc">{task.description}</div>
            </>
          )}
          {task.taskFreeTexts && task.taskFreeTexts.length > 0 && (
            <div className="task-free-text">
              <div className="section-title">{TaskDetailsHebrew.FreeText}</div>
              {task.taskFreeTexts.map((text: string, index: number) => (
                <div className="text-free" key={index}>
                  {text}
                </div>
              ))}
            </div>
          )}
          {task.questionTask && (
            <div className="task-ques">
              <div className="question-section">
                <div className="q-head">
                  <div className="section-title">{TaskDetailsHebrew.Q}</div>
                  <div className="q-task-text">
                    {task.questionTask.question}
                  </div>
                </div>
                <div className="section-title">{TaskDetailsHebrew.answers}</div>
                <div className="answers">
                  {task.questionTask.answers.map(
                    (answer: string, index: number) => (
                      <div
                        key={index}
                        className={
                          index === task.questionTask?.correctAnswer
                            ? "correct-answer"
                            : ""
                        }
                      >
                        {answer}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
          {task.mediaList && task.mediaList.length > 0 && (
            <div className="task-media-list">
              <div className="section-title">{TaskDetailsHebrew.Media}</div>
              <MediaViewer mediaList={task.mediaList} />
            </div>
          )}
          <div className="section-title">
            {task.withMsg ? TaskDetailsHebrew.withMsg : TaskDetailsHebrew.noMsg}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
