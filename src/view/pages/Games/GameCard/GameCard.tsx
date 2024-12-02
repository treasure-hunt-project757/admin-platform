import { FC } from "react";
import "./GameCard.scss";
import { Game } from "../../../../redux/models/Interfaces";
import { EditIcon, DeleteIcon } from "../../../photos";
import { useDispatch } from "react-redux";
import {
  setCard,
  setIsAddUnitPageFlag,
  setIsEditing,
  setIsEditUnitPage,
} from "../../../../redux/slices/GlobalStates";
import { Link } from "react-router-dom";

interface GameCardProps {
  object: Game;
  onShowConfirm: (game: Game) => void;
  onEditGame: (game: Game) => void;
}

const GameCard: FC<GameCardProps> = ({ object, onShowConfirm }) => {
  const dispatch = useDispatch();
  return (
    <div className="game-card">
      <div className="card-header">
        <div className="title">{object.gameName}</div>
        <div className="buttons">
          <Link to="/EditGame">
            <button
              className="edit-button"
              onClick={() => {
                dispatch(setIsEditUnitPage(false));
                dispatch(setIsEditing(true));
                dispatch(setIsAddUnitPageFlag(false));
                dispatch(setCard(object));
              }}
            >
              <img className="edit-icon" src={EditIcon} alt="Edit" />
            </button>
          </Link>
          <button
            className="delete-button"
            onClick={(e) => {
              e.preventDefault();
              onShowConfirm(object);
            }}
          >
            <img className="delete-icon" src={DeleteIcon} alt="Delete" />
          </button>
        </div>
      </div>
      {object.description !== undefined && (
        <div className="game-card-content">
          <div className="sections">
            <div className="section-title">
              {"תיאור: " + object.description}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCard;
