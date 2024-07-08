import { useEffect, useState } from "react";
import axios from "axios";
import "./requestForm.css";
import { FetchReviews } from "../../API/reviewsAPI";
// import { TeacherSearBar } from "../searchBars/teacherSearchBar/teacherSearchBar"
// import { TeacherSearchList } from "../searchBars/teacherSearchBar/teacherSearchList";
const apiUrl = __API_BASE_URL__;

export default function RequestForm({ form }) {
  const [professors, setProfessors] = useState([]);
  const [professorID, setProfessorID] = useState(""); //professor ID wansn't getting set unless I did this
  useEffect(() => {
    //gets list of professors
    const fetchData = async () => {
      try {
        const result = await axios.get(`${apiUrl}/uni/${uni}/allprofessors`);
        const sortedProfessors = result.data.sort((a, b) => {
          // Compare professors' names alphabetically
          return a.Name.localeCompare(b.Name);
        });
        console.log("sorted professors");
        console.log(sortedProfessors);
        setProfessors(sortedProfessors);
        setProfessorID(sortedProfessors[0].ProfessorID); // initializes ID
      } catch (error) {
        console.error("Error fetching professors:", error);
      }
    };

    fetchData();
  }, []);

  const [difficultyValue, setDifficulty] = useState(1);
  const [qualityValue, setquality] = useState(1);
  const [grade, setGrade] = useState("A+");
  const [termTaken, setTermTaken] = useState("Fall");
  const [year, setYear] = useState(new Date().getFullYear());
  const [comment, setComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [userID, setUserID] = useState("");

  useEffect(() => {
    if (localStorage.getItem("userID") !== null) {
      setUserID(localStorage.getItem("userID"));
      console.log("set UserID to", userID);
    } else {
      console.log("user ID " + localStorage.getItem("userID"));
      console.log("user is not logged in, won't be able to make a post");
    }
  }, []);

  const handleSubmit = () => {
    const updatedTerm = termTaken + " " + year;

    const data = {
      difficultyValue,
      qualityValue,
      grade,
      termTaken: updatedTerm,
      professorID,
      comment,
      classID,
      userID,
    };

    console.log("difficultyValue: " + difficultyValue);
    console.log("utilityValue: " + qualityValue);
    console.log("grade: " + grade);
    console.log("professorID: " + professorID);
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

  const numbers = [1, 2, 3, 4, 5];
  const grades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];
  const semesters = ["Fall", "Spring", "Summer", "Winter"];

  const getLastTenYears = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, index) => currentYear - index);
    return years;
  };

  // Call the function to get the array of last 10 years
  const lastTenYears = getLastTenYears();

  return (
    <div className="request-container">
      {
        <div className="popup">
          <div className="popup-inner">
            <h2>Request Form</h2>

            <div className="top-part">
                <div className="uni-select">
                    <p>Select Uni</p>
                </div>
                <div className="class-select">
                    <p>Select Class</p>
                </div>
            </div>

            <div className="comment">
              <div className="review-inputs">
                <div className="ratingswrapper">
                  <div style={{ marginRight: "10px" }}>Difficulty*</div>
                  <select
                    className="dropdown"
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    {numbers.map((number) => (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ratingswrapper">
                  <div style={{ marginRight: "30px" }}>Utility*</div>
                  <select
                    className="dropdown"
                    onChange={(e) => setquality(e.target.value)}
                  >
                    {numbers.map((number) => (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ratingswrapper">
                  <div style={{ marginRight: "25px" }}>Grade*</div>
                  <select
                    className="dropdown"
                    onChange={(e) => setGrade(e.target.value)}
                  >
                    {grades.map((grades) => (
                      <option key={grades} value={grades}>
                        {grades}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ratingswrapper">
                  <div style={{ marginRight: "2px" }}>Semester*</div>
                  <select
                    className="dropdown"
                    onChange={(e) => setTermTaken(e.target.value)}
                  >
                    {semesters.map((semester) => (
                      <option key={semester} value={semester}>
                        {semester}
                      </option>
                    ))}
                  </select>

                  <div style={{ marginRight: "5px", marginLeft: "10px" }}>
                    Year*
                  </div>
                  <select
                    className="dropdown"
                    onChange={(e) => setYear(e.target.value)}
                  >
                    {lastTenYears.map((grades) => (
                      <option key={grades} value={grades}>
                        {grades}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ratingswrapper">
                  <div style={{ marginRight: "13px" }}>Professor</div>
                  <select
                    className="dropdown"
                    onChange={(e) => setProfessorID(e.target.value)}
                  >
                    {professors.map((professor) => (
                      <option
                        key={professor.ProfessorID}
                        value={professor.ProfessorID}
                      >
                        {professor.Name}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  className="commentBox"
                  type="text"
                  placeholder="Comment..."
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>

              <button className="addReview-button" onClick={handleSubmit}>
                Submit Request
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  );
}
