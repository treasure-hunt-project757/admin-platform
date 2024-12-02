import { FC } from "react";
import { Task } from "../../../../../redux/models/Interfaces";
import { useDispatch } from "react-redux";
import { setTaskAddGame } from "../../../../../redux/slices/GlobalStates";
import "./ChooseTaskCard.scss";

interface ChoosableTaskCardProps {
  object: Task;
  onClick?: () => void;
  onShowConfirm: (task: Task) => void;
  onEditTask: (task: Task) => void;
}

const ChoosableTaskCard: FC<ChoosableTaskCardProps> = ({
  object,
  onClick,
}) => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  // const isEditing = useSelector(
  //   (state: RootState) => state.globalStates.isEditing
  // );

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    dispatch(setTaskAddGame(object));
    if (onClick) {
      onClick();
    }

    // navigate(navigationPath, { state: { selectedTask: object } });
  };

  return (
    <div className="choosable-task-card" onClick={handleClick}>
      <div className="card-header-choosable-task">
        <div className="title-choosable-task">{object.name}</div>
      </div>
      <div className="choosable-task-card-content">
        <div className="sections-choosable-task">
          {object.description && (
            <div className="section-title-choosable-task">
              {object.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChoosableTaskCard;
