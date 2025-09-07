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
  }
});

// Endpoint para agregar un paciente
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

// Endpoint para listar pacientes
app.get('/pacientes', (req, res) => {
  db.all('SELECT * FROM pacientes', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
