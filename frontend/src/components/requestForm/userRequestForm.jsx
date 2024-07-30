import { useEffect, useState } from "react";
import axios from "axios";
import "./userRequestForm.css";
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
  const [classNumber, setClassNumber] = useState("");
  const [professorID, setProfessorID] = useState(-1);
  const [professorName, setProfessorName] = useState("");
  const [professorResults, setProfessorResults] = useState([]);
  const [uniResults, setUniResults] = useState([]);
  const [classResults, setClassResults] = useState([]);
  const [classTypeResults, setClassTypeResults] = useState([]);
  const [classTypeID, setClassTypeID] = useState(-1);
  const [classType, setClassType] = useState("");
  const [difficultyValue, setDifficulty] = useState(0);
  const [qualityValue, setquality] = useState(0);
  const [grade, setGrade] = useState("A+");
  const [termTaken, setTermTaken] = useState("Fall");
  const [year, setYear] = useState("2024");
  const [comment, setComment] = useState("");
  const [userID, setUserID] = useState("");
  const [classFullName, setClassFullName] = useState("");
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    if (localStorage.getItem("userID") !== null) {
      setUserID(localStorage.getItem("userID"));
      setUserEmail(localStorage.getItem("userEmail"))
      setUserName(localStorage.getItem("userName"))
      console.log("set UserID to", userID);
    } else {
      console.log("user ID " + localStorage.getItem("userID"));
      console.log("user is not logged in, won't be able to make a post");
    }
  }, []);

  // useEffect(() => {
  //   console.log("request data: ", requestData);
  // }, [uniID, uniName]);

  const handleSubmit = async () => {
    setTermTaken(termTaken + " " + year)
    console.log("submitting data to requests")
    console.log(   "all data",     
      uniID, 
      classID, 
      userID, 
      professorID,
      professorName,
      uniName,
      className,
      classTypeID,
      comment,
      termTaken,
      grade,
      difficultyValue,
      qualityValue,
      userEmail,
      classType,
      classNumber,
      userName

    )
    // console.log("username: ", userName)
    try{ 
      const response = await axios.post(`${apiUrl}/addrequest`, {
        userName,
        userEmail,
        uniID,
        classID,
        classType,
        classNumber,
        userID,
        professorID,
        universityName,
        professorName,
        className,
        classTypeID,
        comment,
        termTaken,
        grade,
        difficultyValue,
        qualityValue,
      })
      return response.data

    } catch (error) {
      console.log(error)
    }
    };



  const numbers = [1, 2, 3, 4, 5];
  const grades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];
  const semesters = ["Fall", "Spring", "Summer", "Winter"];

  const getLastTenYears = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, index) => currentYear - index);
    return years;
  };

  const classPopup = () => {
    setShowClassPopup(!showClassPopup);
    console.log("classPopup =", showClassPopup);
    setClassID(-1);
    setClassName("");
    setClassNumber("");
    setClassTypeID(-1);
    setClassType("");
    setClassResults([]);
    setClassTypeResults([]);
    setClassFullName("");
  };

  // Call the function to get the array of last 10 years
  const lastTenYears = getLastTenYears();

  //Logging the values of everything -- IDs will be -1 if the user is adding a new item
  useEffect(() => {
    console.log("classTypeID: ", classTypeID);
    console.log("classType: ", classType);
  }, [classTypeID, classType]);

  useEffect(() => {
    console.log("classID: ", classID);
    console.log("className: ", className);
    console.log("classNumber: ", classNumber);
    console.log("fullName: ", classFullName);
  }, [classID, className, classNumber]);

  useEffect(() => {
    console.log("professorID: ", professorID);
    console.log("professorName: ", professorName);
  }, [professorID, professorName]);



  return (
    
        <div className="user-request-wrapper">
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
            <input type="checkbox" onChange={classPopup}></input>
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
                setClassType={setClassType}
              />
              <NewAddonDisplayPrompt ID={classTypeID} />
              <input
                type="text"
                placeholder="Class Number"
                className="requestInput"
                onChange={(e) => setClassNumber(e.target.value)}
              ></input>
              <input
                type="text"
                placeholder="Class Name"
                className="requestInput"
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
                setClassNumber={setClassNumber}
                classFullName={classFullName}
              />
              <ClassSearchResultsList2
                results={classResults}
                setClassResults={setClassResults}
                uniID={uniID}
                setClassID={setClassID}
                setClassName={setClassName}
                setClassNumber={setClassNumber}
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
          
           <div className="ratingswrapper">
              <div style={{marginRight: '10px'}}>Difficulty*</div>
               <select className="dropdown" onChange={(e) => setDifficulty(e.target.value)}>
                {numbers.map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
              </select>
              
            </div>
           
            <div className="ratingswrapper">
              <div style={{marginRight: '30px'}}>Utility*</div>
               <select className="dropdown" onChange={(e) => setquality(e.target.value)}>
                {numbers.map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
              </select>
              
            </div>
            <div className="ratingswrapper">
              <div style={{marginRight: '25px'}}>Grade*</div>
               <select className="dropdown"  onChange={(e) => setGrade(e.target.value)}>
                {grades.map((grades) => (
                  <option key={grades} value={grades}>
                    {grades}
                  </option>
                ))}
              </select>
            </div>
            <div className="ratingswrapper">
              <div style={{marginRight: '2px'}}>Semester*</div>
               <select className="dropdown" onChange={(e) => setTermTaken(e.target.value)}>
                {semesters.map((semester) => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
                ))}
              </select>

              <div style={{marginRight: '5px', marginLeft: '10px'}}>Year*</div>
               <select className="dropdown" onChange={(e) => setYear(e.target.value)}>
                {lastTenYears.map((grades) => (
                  <option key={grades} value={grades}>
                    {grades}
                  </option>
                ))}
              </select>
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
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
    
          </div>

        </div>
  );
}
