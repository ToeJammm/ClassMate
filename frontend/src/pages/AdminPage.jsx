import "./AdminPage.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RequestList from "../components/requestList/requestList";
import RequestForm from "../components/requestForm/requestForm";
import { FetchRequests } from "../API/reviewsAPI";

export default function AdminPage() {
  const [requests, setRequests] = useState([]);
  const form = [];
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
    <>
      <div className="back">
        <img
          className="backArrow"
          onClick={() => navigate(-1)}
          src="/public/images/arrow.png"
          alt="ClassMateLogo"
        />
      </div>
      <div className="adminPage">
        <div className="welcome">
          Welcome Admin, {localStorage.getItem("userName")}
        </div>
        <div className="lowerPart">
          <div className="admin-form">
            <RequestForm form={form} />
          </div>
          <div className="requests">
            <RequestList requests={requests} />
          </div>
        </div>
      </div>
    </>
  );
}
