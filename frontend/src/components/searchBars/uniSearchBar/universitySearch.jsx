// eslint-disable-next-line no-unused-vars
import {React, useState } from 'react';
import "./universitySearchBar.css"

const apiUrl = __API_BASE_URL__;

export const SearchBar = ({ setResults, setUniName, setUniID, uniName }) => {
    const [input, setInput] = useState("");

    
    const fetchData = async (value) => {
            const response = await fetch(`${apiUrl}/universities`);
            const json = await response.json();
            const result = json.filter((uni) => {
                return uni && value &&
                uni.UniName && 
                uni.UniName.toLowerCase().includes(value.toLowerCase());
            });
           setResults(result); 
    };
        
    const handleChange = (value) => {
        setInput(value);
        fetchData(value);
        if (setUniName) {
            setUniName(value);
            setUniID(-1);
        }
    }

    return (
        <div className='uni-Searchbar-container'>
            <div className='searchBar'>
            <input className='textBox'
                type="text"
                placeholder="Search University..."
                value={uniName}
                onChange={(e) => handleChange(e.target.value)}
            />
        </div>
        </div>
        
    );
}

