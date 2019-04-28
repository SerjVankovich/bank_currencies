const app = require('express')();
const express = require('express')
const URL = require('./config').API
const localStorage = require('node-localstorage').LocalStorage
const {scrapeIt, makeRequest} = require('./scrapper')

const LocalStorage = new localStorage('./local')

app.set('views', `./views`)
app.set('view engine', 'pug')

app.use(express.urlencoded())

app.get('/', (req, res) => {
    const currencies = JSON.parse(LocalStorage.getItem('currencies'))
    if (currencies) {
        const date = new Date(currencies.date.slice(18))
        const today = new Date()
        const day = date.getDate()
        const month = date.getMonth()
        const year = date.getFullYear()

        const todayDay = today.getDate()
        const todayMonth = today.getMonth()
        const todayYear = today.getFullYear()

        if (day === todayDay && month === todayMonth && year === todayYear) {
            return res.render('currency_table', currencies)
        }
    }
    scrapeIt(URL).then(currencies => {
        LocalStorage.setItem('currencies', JSON.stringify(currencies))
        res.render('currency_table', currencies)
    })
    
})

app.post('/change', (req, res) => {
    const body = req.body
    const currencies = JSON.parse(LocalStorage.getItem('currencies'))
    if (currencies) {
        const currency = currencies.currencies.find(cur => cur.code.toLowerCase() === body.code.toLowerCase())
        return res.render('change', {...body, currency})
    }
    scrapeIt(URL).then(currencies => {
        const currency = currencies.currencies.find(cur => cur.code.toLowerCase() === body.code.toLowerCase())
        res.render('change', {...body, currency})
    })
    
})
app.listen(3000, () => console.log("Server starts at port 3000"))