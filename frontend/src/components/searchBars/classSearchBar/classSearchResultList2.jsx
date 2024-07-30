// eslint-disable-next-line no-unused-vars
import React from "react";
import "../uniSearchBar/universitySearchBar.css"
import { ClassSearchResult } from "./classSearchResult";
import { useNavigate } from "react-router-dom";


export const ClassSearchResultsList2 = ({ results, uniID, setClassID, setClassName, setClassNumber, setClassFullName, setClassResults }) => {
  const navigate = useNavigate();

  const handleItemClick = (result) => {

    if (setClassID) { //For request form
      setClassID(result.ClassID);
      setClassName(result.ClassName);
      setClassNumber(result.ClassNum);
      setClassFullName(result.FullName)
      setClassResults([])
    }

    // Navigate to the UniversityPage with the selected result as state
    console.log("clicked on class from: " + uniID);
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
            <ClassSearchResult result={result} />
          </div>
        );
      })}
    </div>
  );
};