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
      <div className="searchBar">
        <h1 className="home-call">Find Your University</h1>
        <SearchBar setResults={setResults} />
        <SearchResultsList results={results} />
        {localStorage.getItem("loggedIn") == "true" ? 
            <NavLink to="/Request">
              <button className="navBar-logout-text" >
                Request a new thing
              </button>
            </NavLink>
              :
            <NavLink to="/Login">
              <button className="navBar-logout-text" >
                Request a new thing
              </button>
            </NavLink>
              }
      </div>
    </div>
      
  )
}

export default Home