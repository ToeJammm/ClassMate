// eslint-disable-next-line no-unused-vars
import {React, useState } from 'react';
import "./professorSearch.css"

const apiUrl = __API_BASE_URL__;

export const ProfessorSearchBar = ({ setResults, uniID, setProfessorID, setProfessorName, professorName }) => {
    const [input, setInput] = useState("");
    
    const fetchData = async (value) => {
            const response = await fetch(`${apiUrl}/uni/${uniID}/allprofessors`);
            const json = await response.json();
            const result = json.filter((professor) => {
                return professor && value &&
                professor.Name && 
                uniID && 
                professor.ProfessorID &&
                professor.Name.toLowerCase().includes(value.toLowerCase());
            });
           setResults(result); 

    };
        
    const handleChange = (value) => {
        setInput(value);
        fetchData(value);
        if (setProfessorName) {
            setProfessorName(value);
            setProfessorID(-1);
        }
    }

    return (
        <div className='searchBar-container'>
            <div className='searchBar'>
            <input className='textBox'
                type="text"
                placeholder="Search Professor from Uni..."
                value={professorName}
                onChange={(e) => handleChange(e.target.value)}
            />
        </div>
        </div>
        
    );
}

