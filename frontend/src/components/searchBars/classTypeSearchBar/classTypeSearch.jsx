// eslint-disable-next-line no-unused-vars
import {React, useState } from 'react';
import "./classTypeSearch.css"

const apiUrl = __API_BASE_URL__;

export const ClassTypeSearchBar = ({ setResults, uniID, setClassTypeID, setClassTypeName, classTypeName }) => {
    const [input, setInput] = useState("");

    console.log("Running ClassTypeSearchBar");
    
    const fetchData = async (value) => {
            const response = await fetch(`${apiUrl}/${uniID}/classTypes`);
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
        <div className='classType-searchBar-border'>
            <div className='classType-searchBar'>
            <input className='classType-textBox'
                type="text"
                placeholder="Search Class Type..."
                value={classTypeName}
                onChange={(e) => handleChange(e.target.value)}
            />
        </div>
        </div>
        
    );
}

