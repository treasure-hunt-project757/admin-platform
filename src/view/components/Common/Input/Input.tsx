import { FC } from "react";

// import { Sector } from "../../../../redux/models/Interfaces";
import "./HomePage.scss";
interface InputProps {
    inputPlaceHolder: string;
    input: string;
    setInput: (input: string) => void;
}
const Input: FC<InputProps> = ({ }) => {
    return (
        <div className="input-container">

        </div>
    );
};

export default Input;
