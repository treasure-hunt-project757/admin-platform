import { FC } from "react";
import "./TaskCard.scss";
import { Task } from "../../../../redux/models/Interfaces";
import { EditIcon, DeleteIcon } from "../../../photos";
import { IoDuplicate } from "react-icons/io5";

interface TaskCardProps {
  object: Task;
  onShowConfirm: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDuplicateTask: (task: Task) => void;
}

const sectionTitles = {
  description: "תיאור : ",
};

const TaskCard: FC<TaskCardProps> = ({
  object,
  onShowConfirm,
  onEditTask,
  onDuplicateTask,
}) => {
  return (
    <div className="task-card">
      <div className="card-header-task">
        <div className="title-task">{object.name}</div>
        <div className="buttons-task">
          <button
            className="edit-button-task"
            onClick={(e) => {
              e.preventDefault();
              onEditTask(object);
            }}
          >
            <img className="edit-icon-task" src={EditIcon} alt="Edit" />
          </button>
          <button
            className="delete-button-task"
            onClick={(e) => {
              e.preventDefault();
              onShowConfirm(object);
            }}
          >
            <img className="delete-icon-task" src={DeleteIcon} alt="Delete" />
          </button>
          <button
            className="duplicate-button-task"
            onClick={(e) => {
              e.preventDefault();
              onDuplicateTask(object);
            }}
          >
            <IoDuplicate className="duplicate-icon-task" color="white" />
          </button>
        </div>
      </div>
      <div className="task-card-content-task">
        <div className="sections-task">
          {object.description && (
            <div className="section-title-task">
              {sectionTitles.description + object.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
