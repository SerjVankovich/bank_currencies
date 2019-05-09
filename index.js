// Libraries import
const app = require('express')();
const express = require('express')
const localStorage = require('node-localstorage').LocalStorage
const { check } = require('express-validator/check')

// Modules import
const mainController = require('./controllers/mainController').mainController
const changeController = require('./controllers/changeController').changeController

// Initiate our storage
const LocalStorage = new localStorage('./local')

// Set template package and Pug Engine
app.set('views', `./views`)
app.set('view engine', 'ejs')

// Set Body parser
app.use(express.urlencoded())

// Main route
app.get('/', mainController(LocalStorage))

// Change route on user input
app.post('/change', [
    check('amount').isFloat().isLength({min: 1}).withMessage("Invalid amount. Amount should be number"),
    check('code').isLength({min: 3}).withMessage("Invalid currency code. Currency code should be from 3 letters")
],  changeController(LocalStorage))

// Start the server
app.listen(3000, () => console.log("Server starts at port 3000"))