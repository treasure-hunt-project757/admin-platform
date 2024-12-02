import React from "react";
import MediaViewer from "../../../../components/Common/MediaViewer/MediaViewer";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { useLocation, useNavigate } from "react-router-dom";
import "./TaskDetailsAddGame.scss";

const TaskDetailsHebrew = {
  Description: "תיאור המשימה",
  FreeText: "טקסט חופשי",
  Q: "שאלה",
  answers: "תשובות",
  withMsg: "המשימה כוללת הודעה",
  noMsg: "המשימה ללא הודעה",
  Media: "מדיה",
  AddTaskButton: "הוסף לחוליה",
};

const TaskDetailsAddGame: React.FC = () => {
  const task = useSelector(
    (state: RootState) => state.globalStates.taskAddGame
  );
  // const isEditingPage = useSelector(
  //   (state: RootState) => state.globalStates.isEditing
  // );
  // const isEditEditUnitPage = useSelector(
  //   (state: RootState) => state.globalStates.isEditUnitPage
  // );
  // const isAddUnitPage = useSelector(
  //   (state: RootState) => state.globalStates.isAddUnitPageFlag
  // );
  const navigate = useNavigate();
  const location = useLocation();
  const navigationPath = location.state?.fromParent;

  if (!task) {
    return null;
  }

  const handleAddTask = () => {
    console.log("nav is ", navigationPath, " from");
    navigate(navigationPath, { state: { selectedTask: task } });
    // if (isEditingPage) {
    //   navigate(navigationPath, { state: { selectedTask: task } });
    // } else if (isEditEditUnitPage) {
    //   navigate("/Edit-EditUnit", { state: { selectedTask: task } });
    // } else if (isAddUnitPage) {
    //   navigate("/AddUnit", { state: { selectedTask: task } });
    // }
  };

  return (
    <div className="task-container-add-game" dir="rtl">
      <div className="overlay-add-game" />
      <div className="task-details-add-game">
        <div className="task-title-add-game">{task.name}</div>
        <div className="task-content-add-game">
          {task.description && (
            <>
              <div className="section-title-add-game">
                {TaskDetailsHebrew.Description}
              </div>
              <div className="task-desc-add-game">{task.description}</div>
            </>
          )}
          {task.taskFreeTexts && task.taskFreeTexts.length > 0 && (
            <div className="task-free-text-add-game">
              <div className="section-title-add-game">
                {TaskDetailsHebrew.FreeText}
              </div>
              {task.taskFreeTexts.map((text: string, index: number) => (
                <div className="text-free-add-game" key={index}>
                  {text}
                </div>
              ))}
            </div>
          )}
          {task.questionTask && (
            <div className="task-ques-add-game">
              <div className="question-section-add-game">
                <div className="q-head-add-game">
                  <div className="section-title-add-game">
                    {TaskDetailsHebrew.Q}
                  </div>
                  <div className="q-task-text-add-game">
                    {task.questionTask.question}
                  </div>
                </div>
                <div className="section-title-add-game">
                  {TaskDetailsHebrew.answers}
                </div>
                <div className="answers-add-game">
                  {task.questionTask.answers.map(
                    (answer: string, index: number) => (
                      <div
                        key={index}
                        className={
                          index === task.questionTask?.correctAnswer
                            ? "correct-answer-add-game"
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
            <div className="task-media-list-add-game">
              <div className="section-title-add-game">
                {TaskDetailsHebrew.Media}
              </div>
              <MediaViewer mediaList={task.mediaList} />
            </div>
          )}
          <div className="section-title-add-game">
            {task.withMsg ? TaskDetailsHebrew.withMsg : TaskDetailsHebrew.noMsg}
          </div>
        </div>
        <button className="add-task-button-add-game" onClick={handleAddTask}>
          {TaskDetailsHebrew.AddTaskButton}
        </button>
      </div>
    </div>
  );
};

export default TaskDetailsAddGame;
