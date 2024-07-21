import "./request.css";

export default function Request({ request, setRequestData }) {

  // handleClick = () => {
  //   //on click...set requestData object
    
  // }


  return (
    <div className="request-wrapper">
      <p className="name">{request.UserName}</p>
      <p className="date">{request.PostDate.slice(0, 10)}</p>
    </div>
  );
}
