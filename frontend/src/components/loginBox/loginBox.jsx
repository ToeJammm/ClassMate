/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react"
import "./loginBox.css"
import { auth } from "../../../fireBase-config"
import { 
    signInWithEmailAndPassword,
    onAuthStateChanged 
      } from "firebase/auth";
import { LoginContext } from "../../App";
import { useNavigate } from "react-router-dom"
import axios from "axios";

const apiUrl = __API_BASE_URL__;

export default function LoginBox() {

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const[loggedIn, setLoggedIn] = useContext(LoginContext);
  const [error, setError] = useState(null); // State variable for error message
  // const[userID, setUserID] = useState("");
  const navigate = useNavigate();

  const [user, setUser] = useState({});

  const fetchUserID = async (email) => {
    try {
      const response = await axios.get(`${apiUrl}/${email}/userID`);
      console.log(response.data[0].UserID);
      // setUserID(response.data[0].UserID); // Assuming response contains the user ID
      localStorage.setItem("userID", response.data[0].UserID);
  
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      const isLoggedIn = !!currentUser;
      console.log("setting isLoggedIn to: ", isLoggedIn);
      setLoggedIn(isLoggedIn);
      
      if(isLoggedIn) {
        try {
          localStorage.setItem("loggedIn", isLoggedIn); //saving logged In state to local storage to persist through refreshes and navigation
          await fetchUserID(currentUser.email); // gets userID from db
          localStorage.setItem("userEmail", currentUser.email);
          console.log("I just saved " + localStorage.getItem("userID") + " to local storage");
          console.log("saved " + localStorage.getItem("userEmail") + " into local storage");
          console.log("loggedIn set to " + localStorage.getItem("loggedIn"));
          navigate("/");
        } catch (error) {
          setError(error.message);
        }
      } else {
        console.log("removing user from local storage");
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("userEmail"); // Remove user's email if not logged in
        localStorage.removeItem("userID");
      }
    });
      
    return () => unsubscribe();
  }, [loggedIn, setLoggedIn]);


const Login = async () => {
  try {
    const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword,
    );
    console.log(user);
    
    

} catch (error) {
    console.log(error.message);
    setError(error.message);
}
    }


  return (
    <div className="form">
        <h1 className="header">Login</h1>
        <div className="inputs">
          <input className="input" type="text" placeholder="email"
            onChange={(event) => {
              setLoginEmail(event.target.value);
            }}></input> 
          <input className="input" type="password" placeholder="password"
          onChange={(event) => {
            setLoginPassword(event.target.value);
          }}></input> 
        </div>
        <button className="loginButton" onClick={Login}>Submit</button>
        {error && <p className="error-message">{error}</p>}
      
    </div>
  )
}
