import "./AdminPage.css";
import { useEffect, useState, useTransition } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RequestList from "../components/requestList/requestList";
import AdminRequestForm from "../components/requestForm/AdminRequestForm";
import { FetchRequests } from "../API/reviewsAPI";

export default function AdminPage() {
  const [requests, setRequests] = useState([]);
  const [requestData, setRequestData] = useState([])
  const [num, setNum] = useState(0)
  const location = useLocation();
  const navigate = useNavigate();

  //Log request data
  useEffect(() => {
    console.log("requestData: ", requests);
  }, [requests]);

  useEffect(() => {
    const fetchData = async () => {
      const requestData = await FetchRequests(); // define this
      setRequests(requestData);
      console.log(requestData);
    };
    fetchData();
  }, []);

  return (
    <div className="admin-wrapper">
      <div className="back">
        <img
          className="backArrow"
          onClick={() => navigate(-1)}
          src="/public/images/arrow.png"
          alt="ClassMateLogo"
        />
      </div>
      <div className="adminContent">
        
        <div className="lowerPart">
          
            <AdminRequestForm requestData={requestData} num={num}/>
          
          <div className="requests">
            <RequestList requests={requests} setRequestData={setRequestData} setNum={setNum} num={num}/>
          </div>
        </div>
      </div>
    </div>
  );
}



{/* <div className="welcome">
          Welcome Admin, {localStorage.getItem("userName")}
        </div> */}