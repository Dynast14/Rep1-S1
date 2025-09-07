const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

app.use(express.json());

// Inicializar la base de datos SQLite
const db = new sqlite3.Database('./clinica.db', (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
    db.run(`CREATE TABLE IF NOT EXISTS pacientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      edad INTEGER NOT NULL,
      genero TEXT NOT NULL,
      diagnostico TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS doctores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      especialidad TEXT NOT NULL,
      telefono TEXT
    )`);
  }
});

// Métodos para pacientes
app.post('/pacientes', (req, res) => {
  const { nombre, edad, genero, diagnostico } = req.body;
  db.run(
    'INSERT INTO pacientes (nombre, edad, genero, diagnostico) VALUES (?, ?, ?, ?)',
    [nombre, edad, genero, diagnostico],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, nombre, edad, genero, diagnostico });
    }
  );
});

app.get('/pacientes', (req, res) => {
  db.all('SELECT * FROM pacientes', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/pacientes/:id', (req, res) => {
  db.get('SELECT * FROM pacientes WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json(row);
  });
});

app.put('/pacientes/:id', (req, res) => {
  const { nombre, edad, genero, diagnostico } = req.body;
  db.run(
    'UPDATE pacientes SET nombre = ?, edad = ?, genero = ?, diagnostico = ? WHERE id = ?',
    [nombre, edad, genero, diagnostico, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) return res.status(404).json({ error: 'Paciente no encontrado' });
      res.json({ id: req.params.id, nombre, edad, genero, diagnostico });
    }
  );
});

app.delete('/pacientes/:id', (req, res) => {
  db.run('DELETE FROM pacientes WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json({ mensaje: 'Paciente eliminado' });
  });
});

// Métodos para doctores
app.post('/doctores', (req, res) => {
  const { nombre, especialidad, telefono } = req.body;
  db.run(
    'INSERT INTO doctores (nombre, especialidad, telefono) VALUES (?, ?, ?)',
    [nombre, especialidad, telefono],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, nombre, especialidad, telefono });
    }
  );
});

app.get('/doctores', (req, res) => {
  db.all('SELECT * FROM doctores', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/doctores/:id', (req, res) => {
  db.get('SELECT * FROM doctores WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) return res.status(404).json({ error: 'Doctor no encontrado' });
    res.json(row);
  });
});

app.put('/doctores/:id', (req, res) => {
  const { nombre, especialidad, telefono } = req.body;
  db.run(
    'UPDATE doctores SET nombre = ?, especialidad = ?, telefono = ? WHERE id = ?',
    [nombre, especialidad, telefono, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) return res.status(404).json({ error: 'Doctor no encontrado' });
      res.json({ id: req.params.id, nombre, especialidad, telefono });
    }
  );
});

app.delete('/doctores/:id', (req, res) => {
  db.run('DELETE FROM doctores WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) return res.status(404).json({ error: 'Doctor no encontrado' });
    res.json({ mensaje: 'Doctor eliminado' });
  });
});

// Método GET de saludo
app.get('/saludo', (req, res) => {
  res.json({ mensaje: '¡Hola, bienvenido a la API de la clínica!' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
