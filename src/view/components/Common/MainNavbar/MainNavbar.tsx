import { FC, memo } from "react";
import { messageIcon, StaticsIcon } from "../../../photos";
import "./MainNavbar.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

interface MainNavbarProps {
  activeButton: string;
}

const MainNavbar: FC<MainNavbarProps> = ({ activeButton }) => {
  const admin = useSelector(
    (state: RootState) => state.globalStates.loggedInAdmin
  );
  const ObjectsPage = useSelector(
    (state: RootState) => state.globalStates.isObjectsPage
  );

  return (
    <div className="main-navbar" dir="rtl">
      <div className="title">{ObjectsPage ? "אובייקטים" : activeButton}</div>
      <div className="statics-button">
        <div className="message-container">
          <img className="message-icon" src={messageIcon} alt="messageIcon" />
          <span className="name">{`שלום ${admin?.username || "Admin"}`}</span>
        </div>
        <img className="statics-img" src={StaticsIcon} alt="Statics" />
      </div>
    </div>
  );
};

export default memo(MainNavbar);
