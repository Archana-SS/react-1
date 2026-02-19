import { Link, useNavigate } from "react-router-dom";
import "../styles/main.css";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) return null; 
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2>✈️ Aero-Maintain</h2>

      <div className="nav-links">
        {user.role.toLowerCase() === "manager" && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/aircraft">Aircraft</Link>
          </>
        )}
        <Link to="/components">Components</Link>
        <Link to="/maintenance">Maintenance</Link>
        <Link to="/faults">Faults</Link>
      </div>

      <div className="user-section" ref={dropdownRef}>
        <span className="welcome-text">Welcome, {user.username}</span>

        <div className="avatar" onClick={() => setOpen(!open)}>
          {user.username.charAt(0).toUpperCase()}
        </div>

        {open && (
          <div className="dropdown">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;


// import { Link } from "react-router-dom";
// import "../styles/main.css"
// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// function Navbar(){
//     const { user, logout } = useContext(AuthContext);

//     if (!user) return null;

//     return (
//       <nav className="navbar">
//         <span>
//           Welcome, {user.username} ({user.role})
//         </span>
//         <h2>✈️ Aero-Maintain</h2>
//         <div>
//           {user.role === "manager" && (
//             <>
//               <Link to="/dashboard">Dashboard</Link>
//               <Link to="/aircraft">Aircraft</Link>
//             </>
//           )}
//           <Link to="/components">Components</Link>
//           <Link to="/maintenance">Maintenance</Link>
//           <Link to="/faults">Faults</Link>
//         </div>
//         <button onClick={logout}>Logout</button>
//       </nav>
//     );
// }

// export default Navbar