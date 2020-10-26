const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database : 'trabajofinal'
});

//Conectarnos a la base de datos
connection.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()) //for parsing application/json
app.use(express.urlencoded({extended: true})) //for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  res.send("Bienvenido a la API del Trabajo Final de Yazz Coronado");
});

app.get('/caricaturas', (req, res) => {
  //Consultar los personajes
  connection.query('SELECT * FROM caricaturas', function (error, results, fields) {
    if(error) {
      res.status(400).json({ error: 'consulta no valida.'});
    }
    //Regresar un objeto json con el listado de las caricaturas.
    res.status(200).json(results);
  });
});


app.get('/caricaturas/:id', (req, res) => {
  const id = Number(req.params.id);
  if(isNaN(id)) {
    res.status(400).json({ error: 'parametros no validos.'});
    return;
  }
  //Consultar las caricaturas
  connection.query(`SELECT * FROM caricaturas WHERE id=?`, [id] ,function (error, results, fields) {
    if(error) {
      res.status(400).json({ error: 'consulta no valida.'});
      return;
    }
    if(results.length === 0) {
      res.status(404).json({ error: 'La caricatura no existe. Verifica bien tus datos.'});
      return;
    }
    //Regresar un objeto json con el listado de los caricaturas.
    res.status(200).json(results);
  });
});

app.post('/caricaturas', (req, res) => {
    console.log("req", req.body);
    const nombre = req.body.nombre;
    const personajes = req.body.personajes;
    const descripcion = req.body.descripcion;
    connection.query(`INSERT INTO caricaturas (nombre, personajes, descripcion) VALUES (?,?,?)`, [nombre, personajes, descripcion], function (error, results, fields){ 
        if(error){
            res.status(400).json({ error: "consulta no valida"});
            return;
        }
        res.status(200).json({ success: true});
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});