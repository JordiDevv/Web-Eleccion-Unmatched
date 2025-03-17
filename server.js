const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/users', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/users', (req, res) => {
    let {
        nombre, alicia, rey_arturo, medusa, simbad, dracula, jekyll_hyde, sherlock,
        invisible, caperucita, beowulf, aquiles, bloody_mary, sun_wukong, yennenga, houdini, genio
    } = req.body;

    alicia = alicia ? alicia : 0;
    rey_arturo = rey_arturo ? rey_arturo : 0;
    medusa = medusa ? medusa : 0;
    simbad = simbad ? simbad : 0;
    dracula = dracula ? dracula : 0;
    jekyll_hyde = jekyll_hyde ? jekyll_hyde : 0;
    sherlock = sherlock ? sherlock : 0;
    invisible = invisible ? invisible : 0;
    caperucita = caperucita ? caperucita : 0;
    beowulf = beowulf ? beowulf : 0;
    aquiles = aquiles ? aquiles : 0;
    bloody_mary = bloody_mary ? bloody_mary : 0;
    sun_wukong = sun_wukong ? sun_wukong : 0;
    yennenga = yennenga ? yennenga : 0;
    houdini = houdini ? houdini : 0;
    genio = genio ? genio : 0;

    db.run(
        `INSERT INTO users (nombre, alicia, rey_arturo, medusa, simbad, dracula,
        jekyll_hyde, sherlock, invisible, caperucita, beowulf, aquiles, bloody_mary,
        sun_wukong, yennenga, houdini, genio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?)`,
        [nombre, alicia, rey_arturo, medusa, simbad, dracula, jekyll_hyde, sherlock,
            invisible, caperucita, beowulf, aquiles, bloody_mary, sun_wukong, yennenga, houdini, genio],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, nombre, alicia, rey_arturo, medusa, simbad, dracula, jekyll_hyde, sherlock, invisible, caperucita, beowulf, aquiles, bloody_mary, sun_wukong, yennenga, houdini, genio });
    });
});

app.post('/check-inputs-calculator', (req, res) => {
    const { inputs } = req.body;
    const placeholders = inputs.map(() => "?").join(",");
    const query = `SELECT nombre FROM users WHERE nombre IN (${placeholders})`;

    db.all(query, inputs, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (rows.length === 4) {
            res.json({ message: "Todos los nombres existen en la DB.", datos: rows });
        } else {
            res.status(400).json({ error: "Debes introducir nombres de usuarios creados." });
        }
    });
});

app.post("/calculate-prio", (req, res) => {
    const { inputs } = req.body;
    const herosRows = ["alicia", "rey_arturo", "medusa", "simbad", "dracula", 
        "jekyll_hyde", "sherlock", "invisible", "caperucita", 
        "beowulf", "aquiles", "bloody_mary", "sun_wukong", 
        "yennenga", "houdini", "genio"];
    const placeholders = inputs.map(() => "?").join(",");

    const query = `SELECT nombre, ${herosRows.join(", ")} FROM users WHERE nombre IN (${placeholders})`;
    db.all(query, inputs, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
    
        const results = rows.map(row => {
            const prio = herosRows.map(col => ({
                hero: col,
                value: row[col]
            }));
            return { nombre: row.nombre, prio };
        });
    
        res.json({ result: results });
    });
});

app.post("/update-priorities", (req, res) => {
    const updates = req.body.updates;
    
    const updatePromises = updates.map(update => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE users SET ${update.hero} = ? WHERE nombre = ?`;
            db.run(query, [update.newValue, update.nombre], function (err) {
                if (err) reject(err);
                else resolve();
            });
        });
    });

    Promise.all(updatePromises)
        .then(() => res.json({ success: true }))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.delete('/users/:id', (req, res) => {
    db.run("DELETE FROM users WHERE id = ?", req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Usuario eliminado" });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});