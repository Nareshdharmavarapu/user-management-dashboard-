import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

const UserForm = () => {
  const [user, setUser] = useState({ name: "", email: "", phone: "", role: "" });
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch user data if editing
  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const res = await axios.get(`${API_URL}/${id}`);
          if (res.data.data) {
            setUser(res.data.data);
          }
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }
      };

      fetchUser();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!user.name || !user.email || !user.phone) {
      alert("Name, Email, and Phone are required.");
      return;
    }

    try {
      if (id) {
        // Edit existing user
        await axios.put(`${API_URL}/${id}`, user);
      } else {
        // Add new user
        await axios.post(API_URL, user);
      }

      navigate("/");
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  return (
    <div className="container">
      <h2>{id ? "Edit" : "Add"} User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={user.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={user.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={user.phone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="role"
          placeholder="Role (e.g. Admin)"
          value={user.role}
          onChange={handleChange}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" className="btn-primary">
            {id ? "Update" : "Add"} User
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;

