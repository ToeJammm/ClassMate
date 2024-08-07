
import "./review.css";
import axios from "axios";

 const apiUrl = __API_BASE_URL__; // Replace with your actual API URL

export default function Review({ review, setReviews }) {
  
  const handleDelete = async (commentID) => {
    console.log("attempting to delete comment: ", commentID)
    try {
      const response = await axios.delete(`${apiUrl}/deletecomment`, {
        data: { commentID: commentID },
      });
  
      // Handle the response data if needed
      console.log("Comment deleted successfully:", response.data);

      // Update the reviews state to remove the deleted review
      setReviews(prevReviews => prevReviews.filter(review => review.CommentID !== commentID));
    } catch (error) {
      // Handle any errors that occur
      console.error("Error deleting comment:", error);
    }
  };


  return (
    <div className="review-wrapper">
     
        <div className="under-date">
          <div className="ratings-column">
            <div className="diff-header">Difficulty</div>
            <p className="diff-rating">{review.DifficultyValue}</p>
            <p className="qual-header">Utility</p>
            <p className="qual-rating">{review.QualityValue}</p>
          </div>
          <div className="content-right">
            <div className="class-metadata">
             <div>Professor: {review.ProfessorName}</div> 
             <div>Term Taken: {review.TermTaken}</div>
            </div>
            <p className="review-content">{review.Comment}</p>
            <div className="postdate-wrapper">
              Posted:
         <p className="postdate">{review.PostDate && review.PostDate.substring(0,10)}</p> 
        </div>
        {localStorage.getItem("admin") === "1" && <div className="delete-comment" onClick={(() => {handleDelete(review.CommentID)})}>Delete Review</div>}
          </div>
        </div>
      
    </div>
  );
}
