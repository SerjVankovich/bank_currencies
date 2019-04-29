const app = require('express')();
const express = require('express')
const localStorage = require('node-localstorage').LocalStorage
const mainController = require('./controllers/mainController').mainController
const changeController = require('./controllers/changeController').changeController
const { check } = require('express-validator/check')

const LocalStorage = new localStorage('./local')

app.set('views', `./views`)
app.set('view engine', 'pug')

app.use(express.urlencoded())

app.get('/', mainController(LocalStorage))

app.post('/change', [
    check('amount').isFloat().isLength({min: 1}).withMessage("Invalid amount. Amount should be number"),
    check('code').isLength({min: 3}).withMessage("Invalid currency code. Currency code should be from 3 letters")
],  changeController(LocalStorage))


app.listen(3000, () => console.log("Server starts at port 3000"))