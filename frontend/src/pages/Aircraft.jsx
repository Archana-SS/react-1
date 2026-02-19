import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "../styles/form.css";
import "../styles/table.css";
import axios from "axios";

function Aircraft() {
  const [aircraft, setAircraft] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    model: "",
    registration_number: "",
    total_flight_hours: "",
    status: "ACTIVE",
  });

  const {user}=useContext(AuthContext)

  /*const fetchAircraft = async () => {
    const res = await api.get("/aircraft");
    setAircraft(res.data);
  };*/

  /*const fetchAircraft = async () => {
    try {
      const res = await api.get("/aircraft/");
      setAircraft(res.data);
    } catch (error) {
      console.error("Error fetching aircraft:", error);
    }
  };*/

  const fetchAircraft = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:8003/aircraft/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAircraft(response.data);
    } catch (error) {
      console.error("Error fetching aircraft:", error);
    }
  };

  useEffect(() => {
    if(!user)
      return;
    fetchAircraft();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/aircraft/${editingId}`, {
        ...form,
        total_flight_hours: Number(form.total_flight_hours),
      });
    } else {
      await api.post("/aircraft/", {
        ...form,
        total_flight_hours: Number(form.total_flight_hours),
      });
    }

    fetchAircraft();
    setEditingId(null);
    setForm({
      model: "",
      registration_number: "",
      total_flight_hours: "",
      status: "ACTIVE",
    });
  };

  const handleEdit = (aircraft) => {
    setEditingId(aircraft.id);
    setForm({
      model: aircraft.model,
      registration_number: aircraft.registration_number,
      total_flight_hours: aircraft.total_flight_hours,
      status: aircraft.status,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this aircraft?")) return;
    await api.delete(`/aircraft/${id}`);
    fetchAircraft();
  };

  return (
    <>
      <h2>Add Aircraft</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="model"
          placeholder="Model"
          value={form.model}
          onChange={handleChange}
        />
        <input
          name="registration_number"
          placeholder="Reg No"
          value={form.registration_number}
          onChange={handleChange}
        />
        <input
          name="total_flight_hours"
          placeholder="Flight Hours"
          type="number"
          value={form.total_flight_hours}
          onChange={handleChange}
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="GROUNDED">GROUNDED</option>
        </select>
        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>

      <h2>Aircraft List</h2>
      <table>
        <thead>
          <tr>
            <th>Model</th>
            <th>Reg No</th>
            <th>Flight Hours</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {aircraft.map((a) => (
            <tr key={a.id}>
              <td>{a.model}</td>
              <td>{a.registration_number}</td>
              <td>{a.total_flight_hours}</td>
              <td>{a.status}</td>
              <td>
                <button onClick={() => handleEdit(a)}>Edit</button>
                <button onClick={() => handleDelete(a.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Aircraft;
