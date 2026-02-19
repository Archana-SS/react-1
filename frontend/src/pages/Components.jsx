import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/form.css";
import "../styles/table.css";

function Components() {
  const [components, setComponents] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    aircraft_id: "",
    last_maintenance_hours: "",
    current_usage_hours: "",
  });

  const [maintenance, setMaintenance] = useState({
    component_id: "",
    technician_name: "",
    remarks: "",
  });

  const fetchComponents = async () => {
    const res = await api.get("/components");
    setComponents(res.data);
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/components/${editingId}`, {
        name: form.name,
        aircraft_id: Number(form.aircraft_id),
        last_maintenance_hours: Number(form.last_maintenance_hours),
        current_usage_hours: Number(form.current_usage_hours),
      });
    } else {
      await api.post("/components", {
        name: form.name,
        aircraft_id: Number(form.aircraft_id),
        last_maintenance_hours: Number(form.last_maintenance_hours),
        current_usage_hours: Number(form.current_usage_hours),
      });
    }

    if (
      Number(form.current_usage_hours) < Number(form.last_maintenance_hours)
    ) {
      alert("Current usage cannot be less than last maintenance hours");
      return;
    }

    fetchComponents();
    setEditingId(null);
    setForm({
      name: "",
      aircraft_id: "",
      last_maintenance_hours: "",
      current_usage_hours: "",
    });
  };

  const handleEdit = (component) => {
    setEditingId(component.id);
    setForm({
      name: component.name,
      aircraft_id: component.aircraft_id,
      last_maintenance_hours: component.last_maintenance_hours,
      current_usage_hours: component.current_usage_hours,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this component?")) return;
    await api.delete(`/components/${id}`);
    fetchComponents();
  };

  const submitMaintenance = async (e) => {
    e.preventDefault();

    await api.post("/maintenance", {
      component_id: Number(maintenance.component_id),
      technician_name: maintenance.technician_name,
      remarks: maintenance.remarks,
    });

    fetchComponents(); // refresh list after maintenance
    setMaintenance({ component_id: "", technician_name: "", remarks: "" });
  };

  return (
    <>
      <h2>Add Component</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Component Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="aircraft_id"
          placeholder="Aircraft ID"
          type="number"
          disabled={editingId!=null}
          value={form.aircraft_id}
          onChange={handleChange}
        />
        <input
          name="last_maintenance_hours"
          placeholder="Last Maintenance Hours"
          type="number"
          value={form.last_maintenance_hours}
          onChange={handleChange}
        />

        <input
          name="current_usage_hours"
          placeholder="Current Usage Hours"
          type="number"
          value={form.current_usage_hours}
          onChange={handleChange}
        />

        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>

      <h2>Components</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Aircraft ID</th>
            <th>Last Maintenance hours</th>
            <th>Current Usage hours</th>
            <th>Usage Hours</th>
            <th>Health</th>
            <th>Actions</th>
            <th>Maintenance Action</th>
          </tr>
        </thead>
        <tbody>
          {components.map((c) => (
            <tr key={c.id} className={c.health_status.toLowerCase()}>
              <td>{c.name}</td>
              <td>{c.aircraft_id}</td>
              <td>{c.last_maintenance_hours}</td>
              <td>{c.current_usage_hours}</td>
              <td>{c.current_usage_hours - c.last_maintenance_hours}</td>
              <td>{c.health_status}</td>
              <td>
                <button onClick={() => handleEdit(c)}>Edit</button>
                <button onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
              <td>
                {c.health_status !== "Good" && (
                  <button
                    onClick={() =>
                      setMaintenance({ ...maintenance, component_id: c.id })
                    }
                  >
                    Log Maintenance
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Log Maintenance</h2>

      <form onSubmit={submitMaintenance}>
        <input
          type="number"
          placeholder="Component ID"
          value={maintenance.component_id}
          disabled
          onChange={(e) =>
            setMaintenance({ ...maintenance, component_id: e.target.value })
          }
          required
        />

        <input
          placeholder="Technician Name"
          value={maintenance.technician_name}
          onChange={(e) =>
            setMaintenance({ ...maintenance, technician_name: e.target.value })
          }
          required
        />

        <input
          placeholder="Remarks"
          value={maintenance.remarks}
          onChange={(e) =>
            setMaintenance({ ...maintenance, remarks: e.target.value })
          }
        />

        <button type="submit">Log Maintenance</button>
      </form>
    </>
  );
}

export default Components;
