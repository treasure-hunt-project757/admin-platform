import { FC } from 'react'
import { ObjectLocation } from '../../../../redux/models/Interfaces';
import { EditIcon, DeleteIcon } from '../../../photos';
import './ObjectsCard.scss';

interface ObjectCardProps {
    object?: ObjectLocation;
    onShowConfirm: (objectLocation: ObjectLocation) => void;
    onEditTask: (objectLocation: ObjectLocation) => void;
}

const objectTitles = {
    objectName: "שם אובייקט : ",
    // gamesNumber: "מספר המשחקים : ",
};

const ObjectsCard: FC<ObjectCardProps> = ({ object, onShowConfirm }) => {
    return (
        <div>
            {
                object && (
                    <div className='object-card' style={{ background: "#264653" }}>
                        <div className='card-header'>
                            <div className='buttons'>
                                <button className="edit-button">
                                    <img className='edit-icon' src={EditIcon} alt="edit icon" />
                                </button>
                                <button className="delete-button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onShowConfirm(object);
                                    }}>
                                    <img className='delete-icon' src={DeleteIcon} alt="delete icon" />
                                </button>
                            </div>
                            <div className='title'>{object.name}</div>
                        </div>
                        <div className='object-card-content'>
                            <div className='sections'>
                                <div className='section-title'>
                                    {objectTitles.objectName + object.name}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default ObjectsCard