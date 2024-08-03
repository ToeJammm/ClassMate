import "./AdminPage.css";
import { useEffect, useState, useTransition } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RequestList from "../components/requestList/requestList";
import AdminRequestForm from "../components/requestForm/AdminRequestForm";
import { FetchRequests } from "../API/reviewsAPI";

export default function AdminPage() {
  const [requests, setRequests] = useState([]);
  const [requestData, setRequestData] = useState("")
  const [num, setNum] = useState(0)
  const location = useLocation();
  const navigate = useNavigate();
  const [toRemove, setToRemove] = useState(-1)

  useEffect(() => {
    const fetchData = async () => {
      const requestData = await FetchRequests(); // define this
      setRequests(requestData);
      console.log(requestData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (toRemove !== -1) {
      // Remove the request with the given ID from the requests list
      const updatedRequests = requests.filter(request => request.RequestID !== toRemove);
      setRequests(updatedRequests);
      setToRemove(-1)
    }
  }, [toRemove]);



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
          
            <AdminRequestForm requestData={requestData} num={num} setToRemove={setToRemove} />
          
          <div className="requests">
            <RequestList requests={requests} setToRemove={setToRemove} setRequests={setRequests} setRequestData={setRequestData} setNum={setNum} toRemove={toRemove} num={num} />
          </div>
        </div>
      </div>
    </div>
  );
}


