// eslint-disable-next-line no-unused-vars
import React, { useState, createContext } from "react"

import "./App.css"

import {
createBrowserRouter,
Route,
createRoutesFromElements,
RouterProvider,
} from 'react-router-dom'
//components and pages
import NavBar from "../src/navBars/navBar"
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login"
import UniversityPage from "./pages/UniversityPage";
import ClassPage from "./pages/classPage";
import AdminPage from "./pages/AdminPage";


export const LoginContext = createContext();
 
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<NavBar />}>
      <Route index element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/Admin" element={<AdminPage />} />
      <Route path="/University">
        <Route path=":uniID" element={<UniversityPage />}> 
        </Route>
          <Route path="/University/:uniID/Class/:classID" element={<ClassPage />} >
          </Route>
      </Route>
    </Route>
  )
);

function App() {
const [loggedIn, setLoggedIn] = useState(false);
  
  return (
  <LoginContext.Provider value={[loggedIn, setLoggedIn]}>
    <RouterProvider router={router} />
  </LoginContext.Provider> 
  )
}

export default App