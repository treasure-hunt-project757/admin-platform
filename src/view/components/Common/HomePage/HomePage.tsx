import React, { FC } from "react";
import { Fade } from "react-awesome-reveal";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCard, setSector } from "../../../../redux/slices/GlobalStates";
import "./HomePage.scss";
import AlertMessage from "../AlertMessage/AlertMessage";

interface HomePageProps {
  objects: any[];
  page: string;
  Component: React.ElementType;
  addButton?: string;
  addButtonPath?: string;
  setCardOnClick?: boolean;
  onAddClick?: () => void;
  alertMessage?: string;
}

const HomePage: FC<HomePageProps> = ({
  objects,
  page,
  Component,
  addButton,
  addButtonPath,
  setCardOnClick = true,
  onAddClick,
  alertMessage,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="home-page" dir="rtl">
      {alertMessage && <AlertMessage message={alertMessage} />}
      <div className="content">
        <div
          className="homePage-grid"
          style={{ height: addButton ? "40vw" : "60vw" }}
        >
          {objects.map((ob, index) => {
            const name =
              page === "Game"
                ? ob.gameName
                : page === "Sector"
                ? ob.username
                : ob.name;

            return (
              <Fade key={index}>
                {setCardOnClick ? (
                  <Link
                    to={`/${page}Details/${encodeURIComponent(name)}`}
                    className="link"
                    onClick={() => {
                      dispatch(setCard(ob));
                      {
                        page == "Sector" && dispatch(setSector(ob));
                      }
                      // dispatch(setPage(page));
                    }}
                  >
                    <Component object={ob} />
                  </Link>
                ) : (
                  <div>
                    <Component object={ob} />
                  </div>
                )}
              </Fade>
            );
          })}
        </div>
        {addButton && (
          <div className="add-new">
            <Link
              to={`/${addButtonPath}`}
              className="link"
              onClick={(e) => {
                if (page === "Sector" && onAddClick) {
                  e.preventDefault();
                  const result = onAddClick();
                  if (typeof result === "boolean" && result) {
                    navigate(`/${addButtonPath}`);
                  }
                }
              }}
            >
              <button className="add-button">{addButton}</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
