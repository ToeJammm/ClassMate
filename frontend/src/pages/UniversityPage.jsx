import { useState } from "react";
import "./UniversityPage.css"
import { ClassSearchBar } from "../components/searchBars/classSearchBar/classSearchBar";
import { ClassSearchResultsList } from "../components/searchBars/classSearchBar/classSearchResultList"
import { useLocation, NavLink } from "react-router-dom";




export default function UniversityPage() {
  const [results, setResults] = useState([]);
  const location = useLocation();

  
  const result  = location.state.result;

  return (
    <div className="university-container">
      <div className="back"><NavLink to="/"><img className="backArrow" src="/public/images/arrow.png" alt="ClassMateLogo" /></NavLink></div>
      <h3>Search For a Class In</h3>
        <h1 className="university-name">{result ? result.UniName : "Loading..."}</h1>
        <div className="request-button">
         {localStorage.getItem("loggedIn") == "true" ? 
            <NavLink to="/Request">
              <button className="navBar-logout-text" >
               Or Request a New One
              </button>
            </NavLink>
              :
            <NavLink to="/Login">
              <button className="navBar-logout-text" >
                Request a new One
              </button>
            </NavLink>
              }         
        </div>
        <div className="searchBar">
        <ClassSearchBar setResults={setResults} uniID={ result.UniID } />
        <ClassSearchResultsList results={results} Uni={result.UniID}/>
      </div>
        </div>
  )
}
