const express = require('express')
const app = express()
const routes = require('./index')
const path = require('path')
const cookie_parser = require('cookie-parser')
app.use(cookie_parser())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'));
app.use('/pdfjs', express.static(path.join(__dirname, '/node_modules/pdfjs-dist/')));

app.use(routes)
app.listen(9000, console.log('Listening on 9000'))