const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});

app.get('/', (re, res) => {
    return res.json("From Backend Side");
});

app.listen(7071, () => {
    console.log('Server is running on port 7071');
});