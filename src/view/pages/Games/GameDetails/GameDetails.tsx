import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { Game } from "../../../../redux/models/Interfaces";
import { useNavigate } from "react-router-dom";
import "./GameDetails.scss";
import { adminAPI } from "../../../../redux/services/AdminApi";

const GameHeb = {
  CreateNewGame: "הוספת משחק חדש ",
  Name: "שם : ",
  Description: "תיאור : ",
  ViewUnits: "הצגת חוליות",
  NoUnits: "עדיין אין חוליות",
  DownloadQR: "הורדת QR",
  GameName: "שם המשחק: ",
  Sector: "משתמש: ",
};

const GameDetails: React.FC = () => {
  const game: Game = useSelector(
    (state: RootState) => state.globalStates.selectedCard
  );
  const navigate = useNavigate();

  const [sectorName, setSectorName] = useState<string>("כללי");

  useEffect(() => {
    const fetchSectorName = async () => {
      try {
        const admins = await adminAPI.getAllAdmins(); // Fetch all admins
        const adminDetails = admins.find(
          (admin) => admin.adminID === game.adminID
        ); // Find the admin by adminID
        if (adminDetails) {
          setSectorName(adminDetails.sector); // Set the sector name
        }
      } catch (error) {
        console.error("Error fetching admin details:", error);
      }
    };

    fetchSectorName();
  }, [game.adminID]);

  const downloadQRCode = () => {
    if (game.qrcodeURL) {
      fetch(game.qrcodeURL)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `QR_${game.gameName}.png`;
          document.body.appendChild(link);
          link.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
        })
        .catch((error) => console.error("Error downloading QR code:", error));
    }
  };

  return (
    <div className="game-container" dir="rtl">
      <div className="game-overlay"></div>
      <div className="game-details-content">
        {/* Main Title as Sector Name */}
        <div className="game-title">{game.gameName}</div>

        <div className="main-title">
          {" "}
          {GameHeb.Sector} {sectorName}
        </div>

        {/* Game Name with Label */}

        <div className="game-details">
          {game.description && (
            <>
              <div className="section-title">{GameHeb.Description}</div>
              <div className="game-desc">{game.description}</div>
            </>
          )}
          {game.units?.length === 0 ? (
            <div className="no-units">{GameHeb.NoUnits}</div>
          ) : (
            <button
              className="view-units"
              onClick={() => {
                navigate(`/UnitsPageView`, { state: { game } });
              }}
            >
              {GameHeb.ViewUnits}
            </button>
          )}
          {game.qrcodeURL && (
            <div className="qr-section">
              <div className="game-qr">
                <img
                  src={game.qrcodeURL}
                  alt="QR Code"
                  className="qr-code-image"
                />
              </div>
              <button className="download-qr-btn" onClick={downloadQRCode}>
                {/* <img
                  className="download-icon"
                  src={DownloadIcon}
                  alt="Download"
                /> */}
                {GameHeb.DownloadQR}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
