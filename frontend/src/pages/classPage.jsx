import { useEffect, useState } from "react";
import "./classPage.css"
import { useLocation, useNavigate } from "react-router-dom";
import ReviewList from "../components/reviewList/reviewList";
import { ReviewForm } from "../components/reviewForm/ReviewForm";
import { FetchReviews } from "../API/reviewsAPI";
import ReviewHeader from "../components/signUpBox/reviewHeader/reviewHeader";

  export default function ClassPage() {
  const [reviews, setReviews] = useState([]);
  const [alert, setAlert] = useState(false);
  const location = useLocation();
  const classID = location.state && location.state.result && location.state.result.ClassID;
  const uni = location.state && location.state.uni;
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      const reviewsData = await FetchReviews(uni, classID);
      setReviews(reviewsData);
    };
    fetchData();
  }, [uni, classID]);


  
  const setAlertState = (value) => {
    setAlert(value);
  };
  
    useEffect(() => {
        FetchReviews();
    }, [])

    useEffect(() => {
      console.log(reviews); // Log reviews after it has been updated
  }, [reviews]); // Run this effect whenever reviews changes

 
  return (
    <>
     <div className="back" ><img className="backArrow" onClick={() => navigate(-1)} src="/public/images/arrow.png" alt="ClassMateLogo" /></div>
     <div className="class-container">
      <div className="meta-data">
        <ReviewHeader uniID={uni} classID={classID}/>
        <ReviewForm uni={uni} setAlert={setAlertState} classID={classID}/>
        {alert && <p>You must be logged in to make a review</p>}
      </div>
    
          
        
      <div className="review-container">
        <ReviewList reviews={reviews} />
      </div>
    </div>
    </>

   
  )
}
