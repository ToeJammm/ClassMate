// eslint-disable-next-line no-unused-vars
import React, { useState } from "react"
import "./Home.css"

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
      </div>
    </div>
      
  )
}

export default Home