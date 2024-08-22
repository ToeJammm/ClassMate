// eslint-disable-next-line no-unused-vars
import React, { useState } from "react"
import "./Home.css"
import { NavLink } from "react-router-dom";

import { SearchBar } from "../components/searchBars/uniSearchBar/universitySearch";
import { SearchResultsList } from "../components/searchBars/uniSearchBar/uniSearchResultsList";


function Home() {

  const [results, setResults] = useState([]);
  const errorMessage = "(Must be Logged In to Make a Request)"

  return (
    <div className="home-container">
  <h1 className="home-call">Find Your University</h1>

         {localStorage.getItem("loggedIn") == "true" ? 
            <NavLink to="/Request">
              <button className="request-button-home" >
               Or Request a New One
              </button>
            </NavLink>
              :
            <NavLink to="/Login">
              <button className="request-button-home">
                Request a new One
              </button>
            </NavLink>
              }         
        
      <div className="home-searchBar">
        <SearchBar setResults={setResults} />
        <SearchResultsList results={results} />
        </div>
       
    </div>
      
  )
}

export default Home