import "./request.css";

export default function Request({ request }) {
  return (
    <div className="request-wrapper">
      <p className="name">{request.userName}</p>
      <p className="date">{request.postDate.slice(0, 10)}</p>
    </div>
  );
}
