import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

export default function StartScreen({ startGame }) {

  const location = useLocation();

  const activityName = location.pathname.split("/").filter(Boolean).pop();
  const activityType = location.pathname.split("/").filter(Boolean)[0];

  const StartAct = () => {
    startGame(true);
  };

  return (
        <div
        className="start-screen game-container d-flex flex-column align-items-center py-5 cursor-pointer justify-content-center"
        onClick={StartAct}
      >
        <p className="fw-bold font-size-24">
          {activityType === "matching" ? "Eşleştir" : "Grupla"}
        </p>
        <p className="fw-bold font-size-30">{activityName}</p>
        <div className="d-flex align-items-center justify-content-center flex-column start-btn ">
          <FontAwesomeIcon icon={faPlay} className="font-size-30" />
          <span className="fw-bold font-size-30">BAŞLAT</span>
        </div>
        <p className="fw-bold font-size-20 pt-5">
          Her anahtar kelimeyi tanımının yanına sürükleyin ve bırakın.
        </p>
      </div>

  );
}
