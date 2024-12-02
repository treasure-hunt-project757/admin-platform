import React from 'react';
import './ConfirmationDialog.scss';

const ConfirmDialogHeb = {
    message: " ? השינויים שביצעת לא ישמרו.  האם עדיין ברצונך להמשיך",
    Yes: "כן",
    No: "לא"
};

interface ConfirmationDialogProps {
    onConfirm: () => void;
    onCancel: () => void;
    message?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ onConfirm, onCancel, message = ConfirmDialogHeb.message }) => {
    return (
        <div className="confirmation-dialog-overlay">
            <div className="confirmation-dialog">
                <p>{message}</p>
                <button onClick={onConfirm}>{ConfirmDialogHeb.Yes}</button>
                <button onClick={onCancel}>{ConfirmDialogHeb.No}</button>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
