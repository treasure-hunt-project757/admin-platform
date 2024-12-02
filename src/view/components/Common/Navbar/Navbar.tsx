import React from "react";
import { ShibaFullLogo } from "../../../photos";
import "./Navbar.scss";
import { Link } from "react-router-dom";
const Navbar: React.FC = () => {
  // const [isDesktop, setIsDesktop] = useState(false);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsDesktop(window.innerWidth > 768);
  //   };

  //   window.addEventListener("resize", handleResize);
  //   handleResize();
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  // const togglePopup = (
  //   setter: React.Dispatch<React.SetStateAction<boolean>>
  // ) => {
  //   setter((prevState) => !prevState);
  // };

  // const [activeLink, setActiveLink] = useState("");

  // const handleLinkClick = (linkName: string) => {
  //   setActiveLink(linkName);
  // };
  // const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  // const closePopups = () => {
  //   setIsSearchPopupOpen(false);
  // };
  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <button className="navbar-logo">
          <Link to="/">
            <img
              className="navbar-icon-logo"
              src={ShibaFullLogo}
              alt="Epicure Logo"
            />
          </Link>
        </button>
      </div>
      <div className="search-bar">
        {/* {isDesktop && (
              <div
                className="animated-search-bar"
                onClick={() => togglePopup(setIsSearchPopupOpen)}
              >
                <input className="search-input" type="text" placeholder="חיפוש" />
                <img className="navbar-icon" src={SearchIcon} alt="Search" />
              </div>
            )} */}
      </div>
      <div className="navbar-right">
        <div className="navbar-links">
          <div className="navbar-link"> צור קשר</div>
          <div className="navbar-link">עלינו</div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
