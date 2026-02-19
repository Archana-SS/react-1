// frontend/src/pages/Faults.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/form.css";
import "../styles/table.css";

function Faults() {
  const [faults, setFaults] = useState([]);
  const [form, setForm] = useState({
    component_id: "",
    description: "",
    severity: "Low",
  });

  // Fetch all faults
  const fetchFaults = async () => {
    try {
      const res = await api.get("/faults");
      setFaults(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch faults");
    }
  };

  useEffect(() => {
    fetchFaults();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit new fault
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/faults", {
        component_id: form.component_id ? Number(form.component_id) : null,
        description: form.description,
        severity: form.severity,
      });
      fetchFaults(); // Refresh table
      setForm({ component_id: "", description: "", severity: "Low" });
    } catch (err) {
      console.error(err);
      alert("Failed to add fault");
    }
  };

  return (
    <>
      <h2>Add Fault</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="component_id"
          placeholder="Component ID (optional)"
          value={form.component_id}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <select name="severity" value={form.severity} onChange={handleChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button type="submit">Add Fault</button>
      </form>

      <h2>Faults</h2>
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
              <td>{f.reported_date? new Date(f.reported_date).toLocaleString():"-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Faults;


/*import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/table.css";

function Faults() {
  const [faults, setFaults] = useState([]);

  const fetchFaults = async () => {
    const res = await api.get("/faults");
    setFaults(res.data);
  };

  useEffect(() => {
    fetchFaults();
  }, []);

  return (
    <>
      <h2>Fault Reports</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Component ID</th>
            <th>Severity</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {faults.map((f) => (
            <tr key={f.id} className={f.severity.toLowerCase()}>
              <td>{f.id}</td>
              <td>{f.component_id}</td>
              <td>{f.severity}</td>
              <td>{f.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Faults;*/
