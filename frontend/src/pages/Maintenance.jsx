import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/table.css";

function Maintenance() {
  const [logs, setLogs] = useState([]);

  const fetchMaintenanceLogs = async () => {
    const res = await api.get("/maintenance");
    setLogs(res.data);
  };

  useEffect(() => {
    fetchMaintenanceLogs();
  }, []);

  return (
    <>
      <h2>Maintenance History</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Component ID</th>
            <th>Technician</th>
            <th>Remarks</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.component_id != null? log.component_id : "NULL"}</td>
              <td>{log.technician_name}</td>
              <td>{log.remarks || "-"}</td>
              <td>{log.maintenance_date? new Date(log.maintenance_date).toLocaleString():"-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Maintenance;
