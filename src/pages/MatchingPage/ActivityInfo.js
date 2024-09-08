import React from 'react'
import { useParams } from "react-router-dom";


export default function ActivityInfo() {

    const { activityTitle } = useParams();


  return (
    <div className="border-top pt-3 ps-2">
    <p className="fw-bold font-size-24">{activityTitle}</p>
  </div>
  )
}
