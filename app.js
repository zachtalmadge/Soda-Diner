const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const DinerRoutes = require('./src/diner/diner.routes')
const SodaRoutes = require('./src/soda/soda.routes')
const app = express()

mongoose.connect('mongodb://localhost/soda-diner')
    .then(() => console.log('===== Successfully connected to MongoDB ====='))
    .catch((e) => console.log(e))

app.use(express.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'))
})

DinerRoutes(app)
SodaRoutes(app)

app.listen(3000, () => console.log('===== Soda Diner listening on port 3000 ====='))