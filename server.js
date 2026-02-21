// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const connection = require('./mysql_db');

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// =====================
// ROUTES
// =====================

// GET all students (only active records)
app.get("/students", (req, res) => {
  connection.query(
    "SELECT * FROM students WHERE is_active = 1 ORDER BY id",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

// POST a new student
app.post("/students", (req, res) => {
  const { name, course, year } = req.body;

  // Safety check
  if (!name || !course || !year) {
    return res.status(400).json({ error: "Missing name, course, or year in request body" });
  }

  connection.query(
    "INSERT INTO students (name, course, year, is_active) VALUES (?, ?, ?, 1)",
    [name, course, year],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, name, course, year });
    }
  );
});

// PUT update a student by ID (only active records)
app.put("/students/:id", (req, res) => {
  const { id } = req.params;
  const { name, course, year } = req.body;

  // Safety check
  if (!name || !course || !year) {
    return res.status(400).json({ error: "Missing name, course, or year in request body" });
  }

  connection.query(
    "UPDATE students SET name=?, course=?, year=? WHERE id=? AND is_active = 1",
    [name, course, year, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Student not found or has been deactivated" });
      }
      res.json({ id, name, course, year });
    }
  );
});

// DELETE a student by ID (soft delete - sets is_active = 0, keeps ID intact)
app.delete("/students/:id", (req, res) => {
  const { id } = req.params;

  connection.query(
    "UPDATE students SET is_active = 0 WHERE id=? AND is_active = 1",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deactivating student:", err);
        return res.status(500).json({ error: err.message, sqlError: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Student not found or already deactivated" });
      }
      console.log(`Student ${id} deactivated successfully (ID preserved)`);
      res.json({ deleted: true, message: "Student deactivated successfully" });
    }
  );
});

// GET deactivated students (optional endpoint to view deactivated records)
app.get("/students/deactivated", (req, res) => {
  connection.query(
    "SELECT * FROM students WHERE is_active = 0 ORDER BY id",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

// GET all students including deactivated ones
app.get("/students/all", (req, res) => {
  connection.query(
    "SELECT * FROM students ORDER BY id",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

// POST restore a deactivated student (optional endpoint to reactivate)
app.post("/students/:id/restore", (req, res) => {
  const { id } = req.params;

  connection.query(
    "UPDATE students SET is_active = 1 WHERE id=? AND is_active = 0",
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Student not found or already active" });
      }
      res.json({ restored: true, message: "Student restored successfully" });
    }
  );
});



// =====================
// START SERVER
// =====================

// In production, serve the React app for all non-API routes
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Serving React app from dist folder');
  } else {
    console.log('Development mode - run "npm run dev" separately for frontend');
  }
});
