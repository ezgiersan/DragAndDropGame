import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import StartScreen from "./StartScreen";
import EndScreen from "./EndScreen";

const ItemTypes = {
  KEYWORD: "keyword",
};

const Keyword = ({ keyword, id, index, color }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.KEYWORD,
    item: { id, color },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: "1rem 2rem",
        margin: "2px",
        backgroundColor: color,
        cursor: "pointer",
        borderRadius: ".5rem",
        color: "#fff",
        fontWeight: "600",
        fontSize: "18px",
      }}
    >
      {keyword}
    </div>
  );
};

const DropArea = ({ onDrop, acceptedKeyword, feedback, restarted }) => {
  const [droppedColor, setDroppedColor] = useState(null);

  useEffect(() => {
    if (restarted) {
      setDroppedColor(null); // restart olduğunda rengi sıfırla
    }
  }, [restarted]);

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.KEYWORD,
    drop: (item) => {
      onDrop(item.id, item.color);
      setDroppedColor(item.color); //sürüklenen öğenin rengini al
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // feedback correct ise droppedColor kullan, değilse gri yap
  const backgroundColor =
    feedback == "correct" || feedback === undefined
      ? droppedColor
      : feedback === "wrong"
      ? "#666666"
      : isOver
      ? "#e0e0e0"
      : "white";

  return (
    <div
      ref={drop}
      style={{
        padding: "16px",
        margin: "0px",
        minHeight: "50px",
        minWidth: "135px",
        textAlign: "center",
        border: "1.5px solid #b7b7b7",
        borderRadius: ".5rem",
        display: "flex",
        alignItems: "center",
        backgroundColor: backgroundColor,
        color: "#fff",
        fontWeight: 600,
      }}
    >
      {acceptedKeyword ? acceptedKeyword : ""}
      {acceptedKeyword ? (
        <div
          style={{
            position: "relative",
            fontSize: "18px",
            color: "#ffffffB3",
            opacity: feedback ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
            marginLeft: "5px",
          }}
        >
          {feedback === "correct" ? (
            <FontAwesomeIcon icon={faCheck} />
          ) : (
            <FontAwesomeIcon icon={faTimes} />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default function MatchingActivity() {
  const location = useLocation();
  const { state } = location;

  const [keywords, setKeywords] = useState(
    state && state.items ? state.items : []
  );
  const [droppedKeywords, setDroppedKeywords] = useState({});
  const [availableKeywords, setAvailableKeywords] = useState(keywords);

  const [start, setStart] = useState(false);

  //sonuçları kontrol ettiğinde hangisi doğru hangisi yanlış eşleşti onu statete tutar
  const [feedback, setFeedback] = useState({});

  const [isTimerActive, setIsTimerActive] = useState(false);
  const [time, setTime] = useState(0); // Zamanı saniye olarak saklar
  const timerRef = useRef(null);

  const [showEnd, setShowEnd] = useState(false);
  const [showStart, setShowStart] = useState(true);

  const [restarted, setRestarted] = useState(false);

  const colors = ["#1698ea", "#dc2033", "#208144", "#c853d7", "#ef6c02"];

  const [dropColors, setDropColors] = useState({});

  const mixArray = (array) => {
    let mixedArray = [...array];
    for (let i = mixedArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mixedArray[i], mixedArray[j]] = [mixedArray[j], mixedArray[i]];
    }
    return mixedArray;
  };

  useEffect(() => {
    const mixedKeywords = mixArray(keywords);
    setAvailableKeywords(mixedKeywords);

    const initialDropColors = keywords.reduce((acc, item, index) => {
      acc[item.id] = colors[index % colors.length];
      return acc;
    }, {});
    setDropColors(initialDropColors);
  }, [keywords]);

  const handleDrop = (keywordId, definitionId) => {
    setDroppedKeywords((prev) => ({
      ...prev,
      [definitionId]: { id: keywordId, color: dropColors[keywordId] }, // keywordId ve color objesiyle kaydet
    }));

    // veriyi availableKeywords'dan kaldır
    setAvailableKeywords((prevKeywords) =>
      prevKeywords.filter((keyword) => keyword.id !== keywordId)
    );
  };

  const checkMatches = () => {
    stopTimer();

    let newFeedback = {};
    let correct = true;

    if (Object.keys(droppedKeywords).length !== 0) {
      keywords.forEach((keyword) => {
        if (droppedKeywords[keyword.id]?.id !== keyword.id) {
          newFeedback[keyword.id] = "wrong";
          correct = false;
        } else {
          newFeedback[keyword.id] = "correct";
        }
      });
      setFeedback(newFeedback);
    }
    setTimeout(() => {
      setShowEnd(true);
    }, 1500);
  };

  // alt komponentten veriyi al
  const handleStart = (data) => {
    setStart(data);
    startTimer();
    setShowStart(false);
    setRestarted(false);
  };

  const handleReset = () => {
    setShowEnd(false);
    setDroppedKeywords({});
    setAvailableKeywords(mixArray(keywords));
    setFeedback({});
    setTime(0);
    setRestarted(true);
    setShowStart(true);
  };

  useEffect(() => {
    if (isTimerActive) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerActive]);

  const startTimer = () => setIsTimerActive(true);
  const stopTimer = () => setIsTimerActive(false);

  // Zamanı 00:00 formatına dönüştür
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="activity">
      <h2>{formatTime(time)}</h2>
      <DndProvider backend={HTML5Backend}>
        <div>
          <div className="d-flex align-items-center justify-content-center">
            <div className="d-flex flex-wrap align-items-center justify-content-center div-border p-2 keyword-container">
              {availableKeywords.map((keyword, index) => (
                <Keyword
                  key={keyword.id}
                  id={keyword.id}
                  keyword={keyword.keyword}
                  index={index}
                  color={dropColors[keyword.id]}
                />
              ))}
            </div>
          </div>

          <div
            className={`${
              keywords.length > 8 ? "d-flex flex-wrap" : "droparea-container"
            } mt-3`}
          >
            {keywords.map((keyword) => (
              <div
                key={keyword.id}
                className={`${
                  keywords.length > 8 ? "me-2 mb-2 text-center" : "grid-item"
                }`}
              >
                <DropArea
                  onDrop={(id) => handleDrop(id, keyword.id)}
                  acceptedKeyword={
                    droppedKeywords[keyword.id] &&
                    droppedKeywords[keyword.id].id
                      ? keywords.find(
                          (kw) => kw.id === droppedKeywords[keyword.id].id
                        ).keyword
                      : null
                  }
                  feedback={feedback[keyword.id]}
                  restarted={restarted}
                />
                <div className="fw-bold ms-2">{keyword.definition}</div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-center mt-2">
            <Button
              onClick={checkMatches}
              className="send-answer-btn fw-bold font-size-18 px-4"
            >
              Cevapları gönder
            </Button>
          </div>
        </div>
      </DndProvider>

      {showStart ? <StartScreen startGame={handleStart} /> : ""}

      {showEnd ? (
        <EndScreen
          showEnd={showEnd}
          feedback={feedback}
          time={time}
          startGame={handleStart}
          reset={handleReset}
        />
      ) : (
        ""
      )}
    </div>
  );
}
