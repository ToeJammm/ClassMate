//import React from 'react'
import "./navBar.css";
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useContext, useEffect } from "react";
import  { LoginContext } from "../App"
import { signOut } from "firebase/auth";
import { auth } from '../../fireBase-config'

const NavBar = () => {

  //const loggedIn = useContext(LoginContext);
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
const navigate = useNavigate();

useEffect(() => {
  if(loggedIn) {
    console.log("user email stored: ", localStorage.getItem("userEmail"));
  }
}, [loggedIn]);

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('loggedIn');
    if (storedLoggedIn !== null) {
      setLoggedIn(JSON.parse(storedLoggedIn));
    }
  }, [setLoggedIn]);

  const logout = async () => {
    await signOut(auth);
    const isLoggedIn = false;
      await setLoggedIn(isLoggedIn);
      localStorage.setItem("loggedIn", isLoggedIn);
      console.log("removed userID from local storage");
      localStorage.removeItem("userID");
      localStorage.removeItem("userEmail");
      console.log("removed userEmail from local storage");
    console.log("changed logged in to " + localStorage.getItem('loggedIn'));
    navigate("/"); //keeps users from making a post after logging out
  }

  return (
    <div>
      <header className="navBar-container">
        <div className="navBar-logo">
          <NavLink to="/">
            <img className="logo" src="/public/images/finalFav.png" alt="ClassMateLogo" />
          </NavLink>
        </div>
          {loggedIn ? (
            <div className="center-menu">
              <h1 className="navBar-header-text">Hello User</h1>
              <p className="userEmail-text">{localStorage.getItem("userEmail")}</p>
            </div>
            
          ) : (
            <h1 className="navBar-header-text">ClassMate</h1>
          )}
          
        <div className="navBar-buttons">
          {loggedIn ? (
          <>
            <button className="navBar-logout-text" onClick={logout}>Log Out</button>
          </>
          ) : (
            <>
            <NavLink to="/Login" style={{ color: 'inherit', textDecoration: 'inherit'}}>
            <p className="navBar-login-button">Login</p>
          </NavLink>
          <NavLink to="/SignUp" style={{ color: 'inherit', textDecoration: 'inherit' }}>
            <p className="navBar-signUp-button">SignUp</p>
          </NavLink>
          </>
          )}
          
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default NavBar;
