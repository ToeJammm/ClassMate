// eslint-disable-next-line no-unused-vars
import {React, useState } from 'react';
import "./universitySearchBar.css"
import { NewAddonDisplayPrompt } from '../../newAddonDisplayPrompt/newAddonDisplayPrompt';
const apiUrl = __API_BASE_URL__;

export const SearchBar = ({ setResults, setUniName, setUniID, uniName }) => {
    const [input, setInput] = useState("");
    const [uniID, setUniId] = useState(-1);
    
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
        <div className='uni-Searchbar-border'>
            <div className='uni-searchBar'>
            <input className='uni-textBox'
                type="text"
                placeholder="Search University..."
                value={uniName}
                onChange={(e) => handleChange(e.target.value)}
            />
            </div>
          </div>
    );
}
 {/* <NewAddonDisplayPrompt ID={uniID} name={uniName} notHomePage={setUniName}/> */}

