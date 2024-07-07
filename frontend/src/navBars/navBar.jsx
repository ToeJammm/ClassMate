//import React from 'react'
import "./navBar.css";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../App";
import { signOut } from "firebase/auth";
import { auth } from "../../fireBase-config";

const NavBar = () => {
  //const loggedIn = useContext(LoginContext);
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  const navigate = useNavigate();

  console.log(localStorage.getItem("admin"));

  useEffect(() => {
    if (loggedIn) {
      console.log("user email stored: ", localStorage.getItem("userEmail"));
    }
  }, [loggedIn]);

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem("loggedIn");
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
    localStorage.removeItem("userName");
    localStorage.setItem("admin", 0);
    console.log("removed userEmail from local storage");
    console.log("reset admin to 0");
    console.log("changed logged in to " + localStorage.getItem("loggedIn"));
    navigate("/"); //keeps users from making a post after logging out
  };

  return (
    <div>
      <header className="navBar-container">
        <div className="navBar-logo">
          <NavLink to="/">
            <img
              className="logo"
              src="/public/images/finalFav.png"
              alt="ClassMateLogo"
            />
          </NavLink>
        </div>
          <h1 className="navBar-header-text">ClassMate</h1>
        <div className="navBar-buttons">
          {loggedIn ? (
            <>
            {localStorage.getItem("admin") === "1" ? 
            <NavLink to="/Admin">
              <button className="navBar-logout-text" >
                Admin Portal
              </button>
            </NavLink>
              : ''
              }
              {localStorage.getItem('admin') == 0 ? <p>{localStorage.getItem("userName")}</p> : ''}
              
              <button className="navBar-logout-text" onClick={logout}>
                Log Out
              </button>
              
              
            </>
          ) : (
            <>
              <NavLink
                to="/Login"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                <p className="navBar-login-button">Login</p>
              </NavLink>
              <NavLink
                to="/SignUp"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
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
