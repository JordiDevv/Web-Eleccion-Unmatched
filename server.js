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



app.delete('/users/:id', (req, res) => {
    db.run("DELETE FROM users WHERE id = ?", req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Usuario eliminado" });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});