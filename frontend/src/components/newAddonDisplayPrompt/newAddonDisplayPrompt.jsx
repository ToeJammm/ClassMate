// eslint-disable-next-line no-unused-vars
import {React, useState } from 'react';
import { useEffect } from 'react';
import "./newAddonDisplayPrompt.css"

const apiUrl = __API_BASE_URL__;

//Basically, the idea is, if the ID is -1, the user is wanting to add something new. Therefore, this will display. If not, it will not display
export const NewAddonDisplayPrompt = ({ ID, name }) => {
    const [display, setDisplay] = useState(false);
    useEffect(() => {
        console.log("New ID =", ID);
        if (ID === -1) {
            setDisplay(true);
        } else {
            setDisplay(false);
        }
    }, [ID]);

    return (
        display ? (
        <div className='newAddonDisplayPrompt'>
            <p>NEW</p>
        </div>
        ) : (
        ''
        )
    );
}

