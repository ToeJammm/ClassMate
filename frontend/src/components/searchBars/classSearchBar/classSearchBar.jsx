// eslint-disable-next-line no-unused-vars
import {React, useEffect, useState } from 'react';
import "./classSearchBar.css"

const apiUrl = __API_BASE_URL__;

export const ClassSearchBar = ({ setResults, uniID, setClassName, setClassID, setClassNum }) => {
    const [input, setInput] = useState("");

    
    const fetchData = async (value) => {
            const response = await fetch(`${apiUrl}/uni/${uniID}/allclasses`);
            const json = await response.json();
            const result = json.filter((course) => {
                return course && value &&
                course.FullName && 
                course.FullName.toLowerCase().includes(value.toLowerCase());
            });
           setResults(result); 
    };
        
    const handleChange = (value) => {
        setInput(value);
        fetchData(value);
        if (setClassName) {
            setClassName(value);
            setClassID(-1);
            setClassNum(-1);
        }
    }

    return (
        <div className='searchBar-container'>
            <div className='searchBar'>
            <input className='textBox'
                type="text"
                placeholder="Search Class..."
                value={input}
                onChange={(e) => handleChange(e.target.value)}
            />
        </div>
        </div>
        
    );
}

