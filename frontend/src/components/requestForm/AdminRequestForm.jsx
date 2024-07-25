import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./AdminRequestForm.css";
import { FetchReviews } from "../../API/reviewsAPI";
import { SearchBar } from "../searchBars/uniSearchBar/universitySearch";
import { SearchResultsList } from "../searchBars/uniSearchBar/uniSearchResultsList";
import { ClassSearchBar } from "../searchBars/classSearchBar/classSearchBar";
import { ClassSearchResultsList2 } from "../searchBars/classSearchBar/classSearchResultList2";
import { ClassTypeSearchBar } from "../searchBars/classTypeSearchBar/classTypeSearch";
import { ClassTypeResultsList } from "../searchBars/classTypeSearchBar/classTypeResultsList";
import { ProfessorResultsList } from "../searchBars/professorSearchBar/professorResultsList";
import { ProfessorSearchBar } from "../searchBars/professorSearchBar/professorSearch";
import { NewAddonDisplayPrompt } from "../newAddonDisplayPrompt/newAddonDisplayPrompt";

const apiUrl = __API_BASE_URL__;

export default function AdminRequestForm({ requestData, num }) {
  const [showClassPopup, setShowClassPopup] = useState(false);

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
  // const [clickedOnUni, setClickedOnUni] = useState("")

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

  const handleSubmit = () => {
    const updatedTerm = termTaken + " " + year;

    const data = {
      difficultyValue,
      qualityValue,
      grade,
      termTaken: updatedTerm,
      comment,
      classID,
      userID,
    };

   

    console.log("difficultyValue: " + difficultyValue);
    console.log("utilityValue: " + qualityValue);
    console.log("grade: " + grade);
    console.log("comment: " + comment);
    console.log("userID: " + userID);
    console.log("classID: " + classID);
    console.log("termTaken: " + data.termTaken);

    axios
      .post("${apiUrl}/addcomment", data) //post request for review
      .then((response) => {
        console.log("Post request successful", response.data);
        FetchReviews(uni, classID);
        window.location.reload(); // Reload the page after successful submission
      })
      .catch((error) => {
        console.error("Error in post request", error);
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
      setClassType(requestData.ClassType)
    }
  }, [requestData, num]);

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
                setClassTypeName={setClassType}
                classTypeName={classType}
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
          <button className="accept-button" onClick={handleSubmit}>
            Accept
          </button>
          <button className="reject-button" onClick={handleSubmit}>
            Reject
          </button>
          </div>

        </div>
  );
}
