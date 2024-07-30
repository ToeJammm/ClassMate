import "./request.css";

export default function Request({ request, setRequestData, num, setNum }) {

  const handleClick = () => {
    // Grab every part of the request object that we need
    console.log("Button clicked")

      //on click...set requestData object
      setNum(num++)
    setRequestData(request);
    console.log(request)
  }


  return (
    <div className="request-wrapper" onClick={handleClick}>
      <p className="name">{request.UserName}</p>
      <p className="date">{request.PostDate.slice(0, 10)}</p>
    </div>
  );
}
