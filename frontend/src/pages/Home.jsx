// eslint-disable-next-line no-unused-vars
import React, { useState } from "react"
import "./Home.css"
import { NavLink } from "react-router-dom";

import { SearchBar } from "../components/searchBars/uniSearchBar/universitySearch";
import { SearchResultsList } from "../components/searchBars/uniSearchBar/uniSearchResultsList";


function Home() {

  const [results, setResults] = useState([]);

  return (
    <div className="home-container">
  <h1 className="home-call">Find Your University</h1>
 <div className="request-button">
         {localStorage.getItem("loggedIn") == "true" ? 
            <NavLink to="/Request">
              <button className="navBar-logout-text" >
               Or Request a New One
              </button>
            </NavLink>
              :
            <NavLink to="/Login">
              <button className="navBar-logout-text">
                Request a new One
              </button>
            </NavLink>
              }         
        </div>
      <div className="home-searchBar">
        <SearchBar setResults={setResults} />
        <SearchResultsList results={results} />
        </div>
       
    </div>
      
  )
}

export default Home