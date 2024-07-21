// eslint-disable-next-line no-unused-vars
import React from "react";
import "./professorResultsList.css"
import { ProfessorSearchResult } from "./professorSearchResult";

export const ProfessorResultsList = ({ results, setProfessorID, setProfessorName, setResults }) => {

  const handleItemClick = (result) => {
    // Navigate to the UniversityPage with the selected result as state
    if (setProfessorID) { //For request form
      setProfessorID(result.ProfessorID);
      setProfessorName(result.Name);
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
            <ProfessorSearchResult result={result} />
          </div>
        );
      })}
    </div>
  );
};