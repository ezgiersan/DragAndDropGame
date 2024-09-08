import React from "react";
import matchImg from "../pictures/eşleştir.png";
import groupingImg from "../pictures/grup.png";
import { useNavigate } from 'react-router-dom';
import TemplateCard from "../components/TemplateCard";

export default function PickTemplate() {
  const activities = [
    {
      id: 1,
      title: "Eşleştir",
      definition:
        "Her anahtar kelimeyi tanımının yanına sürükleyin ve bırakın.",
      image: matchImg,
    },
    {
      id: 2,
      title: "Grup sıralaması",
      definition: "Her öğeyi sürükleyin ve doğru gruba bırakın.",
      image: groupingImg,
    },
  ];

  const navigate = useNavigate();

  const selectedCard = (id) => {
    if (id === 1) {
      navigate('/matching');
    } else if (id === 2) {
      navigate('/grouping');
    }
  };

  return (
    <div className="pick-template">
      <TemplateCard activities={activities} selectedCard={selectedCard} />
    </div>
  );
}
