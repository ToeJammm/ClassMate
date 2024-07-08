import "./request.css";

export default function Request({ request }) {
  return (
    <div className="request-wrapper">
      <p className="name">{request.UserName}</p>
      <p className="date">{request.PostDate.slice(0, 10)}</p>
    </div>
  );
}
