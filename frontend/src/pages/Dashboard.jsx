import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import StatCard from "../components/StatCard";
import "../styles/dashboard.css";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [aircraft, setAircraft] = useState({});
  const [health, setHealth] = useState({});
  const [maintenanceAlerts, setMaintenanceAlerts] = useState([]);
  const [faults, setFaults] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login"); 
      return;
    }

    const fetchData = async () => {
      try {
        const aircraftRes = await api.get("/dashboard/aircraft-summary");
        setAircraft(aircraftRes.data);

        const healthRes = await api.get("/dashboard/component-health");
        setHealth(healthRes.data);

        const maintenanceRes = await api.get("/dashboard/maintenance-alerts");
        setMaintenanceAlerts(maintenanceRes.data);

        const faultsRes = await api.get("/faults");
        setFaults(faultsRes.data);
      } catch (error) {
        alert("Unauthorized. Please login again.");
        logout();
        navigate("/login");
      }
    };

    fetchData();
  }, [user, navigate, logout]);

    return (
    <>
      <h2>Dashboard</h2>
      <div className="grid">
        <StatCard title="Total Aircraft" value={aircraft.total_aircraft} />
        <StatCard title="Active Aircraft" value={aircraft.active_aircraft} />
        <StatCard title="Grounded Aircraft" value={aircraft.grounded_aircraft} />
        <StatCard title="Good Components" value={health.good} />
        <StatCard title="Warning Components" value={health.warning} />
        <StatCard title="Critical Components" value={health.critical} />
      </div>

      <h3>Maintenance Alerts</h3>
      <table>
        <thead>
          <tr>
            <th>Component ID</th>
            <th>Aircraft ID</th>
            <th>Usage Hours Since Last Maintenance</th>
            <th>Health Status</th>
          </tr>
        </thead>
        <tbody>
          {maintenanceAlerts.map((m) => (
            <tr key={m.component_id}>
              <td>{m.component_id ?? "NULL"}</td>
              <td>{m.aircraft_id}</td>
              <td>{m.usage_hours}</td>
              <td>{m.health_status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Faults */}
      <h3>Faults</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Component ID</th>
            <th>Description</th>
            <th>Severity</th>
            <th>Reported Date</th>
          </tr>
        </thead>
        <tbody>
          {faults.map((f) => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.component_id ?? "NULL"}</td>
              <td>{f.description}</td>
              <td>{f.severity}</td>
              <td>{new Date(f.reported_date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Dashboard;




// import { useEffect, useState } from "react";
// import api from "../services/api";
// import StatCard from "../components/StatCard";
// import "../styles/dashboard.css"

// function Dashboard() {
//   const [aircraft, setAircraft] = useState({});
//   const [health, setHealth] = useState({});
//   const [maintenanceAlerts, setMaintenanceAlerts] = useState([]);
//   const [faults, setFaults] = useState([]);

//   const fetchData = async () => {
//     const aircraftRes = await api.get("/dashboard/aircraft-summary");
//     setAircraft(aircraftRes.data);

//     const healthRes = await api.get("/dashboard/component-health");
//     setHealth(healthRes.data);

//     const maintenanceRes = await api.get("/dashboard/maintenance-alerts");
//     setMaintenanceAlerts(maintenanceRes.data);

//     const faultsRes = await api.get("/faults"); // assuming you added GET /faults
//     setFaults(faultsRes.data);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);


// }

// export default Dashboard;
