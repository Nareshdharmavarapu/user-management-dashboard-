// backend/routes/users.js
const express = require("express");
const router = express.Router();
const db = require("../database");

// Get all users
router.get("/", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "success", data: rows });
    });
});

// Get user by ID
router.get("/:id", (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: "User not found" });
        res.json({ message: "success", data: row });
    });
});

// Create user
router.post("/", (req, res) => {
    const { name, email, phone, role } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Name and email are required" });

    db.run(
        "INSERT INTO users (name, email, phone, role) VALUES (?, ?, ?, ?)",
        [name, email, phone, role],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "User created", id: this.lastID });
        }
    );
});

// Update user
router.put("/:id", (req, res) => {
    const { name, email, phone, role } = req.body;
    const { id } = req.params;

    db.run(
        "UPDATE users SET name = ?, email = ?, phone = ?, role = ? WHERE id = ?",
        [name, email, phone, role, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ message: "User not found" });
            res.json({ message: "User updated" });
        }
    );
});

// Delete user
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted" });
    });
});

module.exports = router;
