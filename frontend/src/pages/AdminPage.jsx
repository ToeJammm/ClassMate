import "./AdminPage.css"

export default function AdminPage() {
  return (
    <div className="adminPage">
      <div className="welcome">Welcome Admin, {localStorage.getItem("userName")}</div>
      <div className="requests">
        
      </div>
    </div>
  )
}
