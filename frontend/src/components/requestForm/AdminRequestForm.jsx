import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminRequestForm.css";
import { SearchBar } from "../searchBars/uniSearchBar/universitySearch";
import { SearchResultsList } from "../searchBars/uniSearchBar/uniSearchResultsList";
import { ClassSearchBar } from "../searchBars/classSearchBar/classSearchBar";
import { ClassSearchResultsList2 } from "../searchBars/classSearchBar/classSearchResultList2";
import { ClassTypeSearchBar } from "../searchBars/classTypeSearchBar/classTypeSearch";
import { ClassTypeResultsList } from "../searchBars/classTypeSearchBar/classTypeResultsList";
import { ProfessorResultsList } from "../searchBars/professorSearchBar/professorResultsList";
import { ProfessorSearchBar } from "../searchBars/professorSearchBar/professorSearch";
import { NewAddonDisplayPrompt } from "../newAddonDisplayPrompt/newAddonDisplayPrompt";
import Review from "../reviewList/review";


const apiUrl = __API_BASE_URL__;

export default function AdminRequestForm({ requestData, num, setToRemove }) {

  const [showClassPopup, setShowClassPopup] = useState(false)
  const [uniID, setUniID] = useState(-1);
  const [uniName, setUniName] = useState("");
  const [classID, setClassID] = useState(-1);
  const [className, setClassName] = useState("");
  const [professorID, setProfessorID] = useState(-1);
  const [professorName, setProfessorName] = useState("");
  const [professorResults, setProfessorResults] = useState([]);
  const [uniResults, setUniResults] = useState([]);
  const [classResults, setClassResults] = useState([]);
  const [classTypeResults, setClassTypeResults] = useState([]);
  const [classTypeID, setClassTypeID] = useState(-1);
  const [difficultyValue, setDifficulty] = useState(0);
  const [qualityValue, setquality] = useState(0);
  const [grade, setGrade] = useState("A+");
  const [termTaken, setTermTaken] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [comment, setComment] = useState("");
  const [userID, setUserID] = useState("");
  const [classFullName, setClassFullName] = useState("");
  const [isChecked, setIsChecked] = useState(false)
  const [classType, setClassType] = useState("")
  const [classNumber, setClassNumber] = useState("")

  useEffect(() => {
    if (localStorage.getItem("userID") !== null) {
      setUserID(localStorage.getItem("userID"));
      console.log("set UserID to", userID);
    } else {
      console.log("user ID " + localStorage.getItem("userID"));
      console.log("user is not logged in, won't be able to make a post");
    }
  }, []);

  useEffect(() => {
    console.log("request data: ", requestData);
  }, [uniID, uniName]);

  const handleAccept = (id) => {
    console.log("Accepting needs to be written")
    if(uniID == -1) {
      //add new uni, new class, and new prof
      setToRemove(id)
    } else if (classID == -1 && professorID == -1) {
      //add new class and prof under uniID
      setToRemove(id)
    } else if (classID == -1) {
      //only add new class
      setToRemove(id)
    } else if (professorID == -1) {
      //only add prof
      setToRemove(id)
    }

    //then add comment at the endwads aw
  }
 
  const handleReject = (id) => {
    axios.delete(`${apiUrl}/removerequest`, {
      data: { requestID: requestData.RequestID }
    })
    .then(response => {
      // Handle the response if needed
      console.log('Request removed:', response.data);
      setToRemove(id)
    })
    .catch(error => {
      // Handle the error if needed
      console.error('Error removing request:', error);
    });
  };

 const handleChecked = () => {
      setIsChecked(!isChecked)
      classPopup(!showClassPopup)
    }

  const handleclassIDNeg = () => {
    if(requestData.ClassID == -1) {
      classPopup(true)
      setIsChecked(true)
    } else {
      handleChecked()
    }
  }


  const numbers = [1, 2, 3, 4, 5];
  const grades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];
  const semesters = ["Fall", "Spring", "Summer", "Winter"];

  const getLastTenYears = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, index) => currentYear - index);
    return years;
  };

  const classPopup = (show) => {
    console.log("classpopup called");
    setShowClassPopup(show);
    if(show == false) {
      setClassID(-1);
      setClassName("");
      setClassNumber("");
      setClassTypeID(-1);
      setClassType("");
      setClassResults([]);
      setClassTypeResults([]);
      setClassFullName("");
      }
  };

  // Call the function to get the array of last 10 years
  const lastTenYears = getLastTenYears();

  //Logging the values of everything -- IDs will be -1 if the user is adding a new item
  useEffect(() => {
    console.log("classTypeID: ", classTypeID);
    console.log("classTypeName: ", classType);
  }, [classTypeID, classType]);

  useEffect(() => {
    console.log("classID: ", classID);
    console.log("className: ", className);
    console.log("fullName: ", classFullName);
  }, [classID, className]);

  useEffect(() => {
    console.log("professorID: ", professorID);
    console.log("professorName: ", professorName);
  }, [professorID, professorName]);

  //use effect for request data to change every variable in the request form
  useEffect(() => {
    if(requestData.ClassID === -1) {
      handleclassIDNeg()
      console.log("class does not exist")
    }
    console.log("requestData: ", requestData);
    if (requestData !== undefined) {
      setUniID(requestData.UniID);
      setUniName(requestData.UniversityName);
      setClassID(requestData.ClassID);
      setClassName(requestData.ClassName);
      setClassNumber(requestData.ClassNumber);
      setProfessorID(requestData.ProfessorID);
      setProfessorName(requestData.ProfessorName);
      setDifficulty(requestData.DifficultyValue);
      setquality(requestData.QualityValue);
      setGrade(requestData.Grade);
      setTermTaken(requestData.TermTaken);
      setComment(requestData.Comment);
      setClassType(requestData.ClassType);
      setClassTypeID(requestData.ClassTypeID);
    }
  }, [requestData, num]); //num was added to update everytime a list item was clicked 

  return (
    
        <div className="popup-inner">
          <h2 className="request-title">Request Form</h2>
          <SearchBar
            setResults={setUniResults}
            setUniName={setUniName}
            setUniID={setUniID}
            uniName={uniName}
          />
          <SearchResultsList
            setResults={setUniResults}
            results={uniResults}
            setUniID={setUniID}
            setUniName={setUniName}
          />

          <div className="checkBox-wrapper">
            <input type="checkbox" 
            checked={isChecked} 
            onClick={handleChecked}></input>
            <p>Check Box If Class Does Not Exist</p>
          </div>

          {showClassPopup ? (
            <div className="class-inputs-popup">
              <ClassTypeSearchBar
                setResults={setClassTypeResults}
                uniID={uniID}
                setClassTypeID={setClassTypeID}
                setClassType={setClassType}
                classType={classType}
              />
              <ClassTypeResultsList
                setResults={setClassTypeResults}
                results={classTypeResults}
                setClassTypeID={setClassTypeID}
                setClassTypeName={setClassType}
              />
              <NewAddonDisplayPrompt ID={classTypeID} />
              <input
                type="text"
                placeholder="Class Number"
                className="requestInput"
                value={classNumber}
                onChange={(e) => setClassNumber(e.target.value)}
              ></input>
              <input
                type="text"
                placeholder="Class Name"
                className="requestInput"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              ></input>
            </div>
          ) : (
            <div className="class-searchbar-popup">
              <ClassSearchBar
                setResults={setClassResults}
                setClassFullName={setClassFullName}
                uniID={uniID}
                setClassID={setClassID}
                setClassName={setClassName}
                setClassNum={setClassNumber}
                classFullName={classFullName}
              />
              <ClassSearchResultsList2
                results={classResults}
                setResults={setClassResults}
                uniID={uniID}
                setClassID={setClassID}
                setClassName={setClassName}
                setClassNum={setClassNumber}
                setClassFullName={setClassFullName}
              />
              <NewAddonDisplayPrompt ID={classID} />
            </div>
          )}
          
            <ProfessorSearchBar
              setResults={setProfessorResults}
              setProfessorID={setProfessorID}
              setProfessorName={setProfessorName}
              professorName={professorName}
              uniID={uniID}
            />
            <ProfessorResultsList
              results={professorResults}
              setResults={setProfessorResults}
              setProfessorID={setProfessorID}
              setProfessorName={setProfessorName}
            />
            <NewAddonDisplayPrompt ID={professorID} />
          

          <div className="selectedInfo">
            <div className="specificInfo">
              <div>Difficulty: </div>
              <div> {difficultyValue ? difficultyValue : ""}</div>
          </div>
          <div className="specificInfo">
              <div>Utility: </div>
              <div> {qualityValue ? qualityValue : ""}</div>
          </div>
          <div className="specificInfo">
              <div>Grade: </div>
              <div>{difficultyValue ? difficultyValue : ""}</div>
          </div>
          <div className="specificInfo">
              <div>Taken: </div>
              <div> {termTaken ? termTaken : ""}</div>
          </div>
            <textarea
              className="adminRequestCommentBox"
              type="text"
              placeholder="Comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
          <div className="button-area">
          <button className="accept-button" onClick={handleAccept}>
            Accept
          </button>
          <button className="reject-button" onClick={() => handleReject(requestData.RequestID)}>
            Reject
          </button>
          </div>

        </div>
  );
}
