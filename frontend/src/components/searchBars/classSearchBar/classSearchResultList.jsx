// eslint-disable-next-line no-unused-vars
import React from "react";
import "./classSearchResultList.css"
import { ClassSearchResult } from "./classSearchResult";
import { useNavigate } from "react-router-dom";


export const ClassSearchResultsList = ({ results, Uni }) => {
  const navigate = useNavigate();

  const handleItemClick = (result) => {

    // Navigate to the UniversityPage with the selected result as state
    console.log("clicked on class from: " + Uni);
    navigate(`Class/${result.ClassID}`, { state: { result: result, uni: Uni } });
  };

  return (
    <div className="class-results-list">
      {results.map((result, id) => {
        return (
          <div
            key={id}
            className="result-link"
            style={{ color: "inherit", textDecoration: "inherit", cursor: "pointer" }}
            onClick={() => handleItemClick(result)}
          >
            <ClassSearchResult result={result} />
          </div>
        );
      })}
    </div>
  );
};