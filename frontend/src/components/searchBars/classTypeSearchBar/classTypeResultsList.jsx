// eslint-disable-next-line no-unused-vars
import React from "react";
import "./classTypeResultsList.css"
import { ClassTypeSearchResult } from "./classTypeSearchResult";

export const ClassTypeResultsList = ({ results, setClassTypeID, setClassTypeName, setResults }) => {

  const handleItemClick = (result) => {
    // Navigate to the UniversityPage with the selected result as state
    if (setClassTypeID) { //For request form
      setClassTypeID(result.ClassTypeID);
      setClassTypeName(result.ClassType);
      setResults([])
    }
  };

  return (
    <div className="results-list">
      {results.map((result, id) => {
        return (
          <div
            key={id}
            className="result-link"
            style={{ color: "inherit", textDecoration: "inherit", cursor: "pointer" }}
            onClick={() => handleItemClick(result)}
          >
            <ClassTypeSearchResult result={result} />
          </div>
        );
      })}
    </div>
  );
};