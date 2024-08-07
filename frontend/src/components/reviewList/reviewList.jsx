import Review from "./review";
import "./reviewList.css";

export default function ReviewList({ reviews, setReviews }) {
  return (
    <div className="review-list">
      {reviews.length === 0 ? (
        <div className="noReviewDiv"><h3>No reviews made yet...</h3></div>
        
      ) : (
        reviews.map((review, id) => (
          <div key={id} className="review-element">
            <Review review={review} setReviews={setReviews}/>
          </div>
        ))
      )}
    </div>
  );
}