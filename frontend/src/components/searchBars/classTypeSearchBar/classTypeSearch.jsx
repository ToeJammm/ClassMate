// eslint-disable-next-line no-unused-vars
import {React, useState } from 'react';
import "./classTypeSearch.css"

const apiUrl = __API_BASE_URL__;

export const ClassTypeSearchBar = ({ setResults, uniID, setClassTypeID, setClassTypeName }) => {
    const [input, setInput] = useState("");

    
    const fetchData = async (value) => {
            const response = await fetch(`${apiUrl}/uni/${uniID}/classtypes`);
            const json = await response.json();
            const result = json.filter((classType) => {
                return classType && value &&
                classType.ClassType && 
                classType.UniID && 
                classType.ClassType.toLowerCase().includes(value.toLowerCase());
            });
           setResults(result); 
    };
        
    const handleChange = (value) => {
        setInput(value);
        fetchData(value);
        if (setClassTypeName) {
            setClassTypeName(value);
            setClassTypeID(-1);
        }
    }

    return (
        <div className='searchBar-container'>
            <div className='searchBar'>
            <input className='textBox'
                type="text"
                placeholder="Search..."
                value={input}
                onChange={(e) => handleChange(e.target.value)}
            />
        </div>
        </div>
        
    );
}

