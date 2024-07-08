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


const adminIDs = JSON.parse(import.meta.env.VITE_ADMIN_IDS);




const apiUrl = __API_BASE_URL__;

export default function LoginBox() {
useEffect(() => {
  console.log("adminIds: ", adminIDs);
}, [])


  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const[loggedIn, setLoggedIn] = useContext(LoginContext);
  const [error, setError] = useState(null); // State variable for error message
  const [admin, setAdmin] = useState(0);
  // const[userID, setUserID] = useState("");
  const navigate = useNavigate();

  const [user, setUser] = useState({});

  const fetchUserID = async (email) => {
    try {
      const response = await axios.get(`${apiUrl}/${email}/userInfo`);
      console.log(response.data[0]);
      // setUserID(response.data[0].UserID); // Assuming response contains the user ID
      console.log("is admin: ", isAdmin(response.data[0].UserID))
      localStorage.setItem("userID", response.data[0].UserID);
      localStorage.setItem("userName", response.data[0].userName);
      if(isAdmin(response.data[0].UserID)) {
        console.log("welcome Admin, setting admin status to 1");
        localStorage.setItem("admin", 1);
      } else {
        localStorage.setItem("admin", 0);
      }
  
    } catch (error) {
      console.log("an error occurred")
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
          console.log("I just saved " + localStorage.getItem("userName") + " to local storage");
          console.log("saved " + localStorage.getItem("userEmail") + " into local storage");
          console.log("loggedIn set to " + localStorage.getItem("loggedIn"));
          navigate("/");
        } catch (error) {
          setError(error.message);
        }
      } else {
        console.log("removing user from local storage");
        localStorage.setItem("loggedIn", false);
        localStorage.removeItem("userEmail"); // Remove user's email if not logged in
        localStorage.removeItem("userID");
      }
    });
      
    return () => unsubscribe();
  }, [loggedIn, setLoggedIn]);


  function isAdmin(userId) {

    // Loop through adminIDs array
    for (let i = 0; i < adminIDs.length; i++) {
      console.log("comparing: ", userId, "and", adminIDs[i]);
      if (userId == adminIDs[i]) {
        return true;
      }
    }
    return false;
  }


const Login = async () => {
  try {
    const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword,
    );
    

    

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
