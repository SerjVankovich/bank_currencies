const app = require('express')();
const URL = require('./config').API
const {scrapeIt, makeRequest} = require('./scrapper')

app.set('views', `./views`)
app.set('view engine', 'pug')


app.get('/', (req, res) => {
    scrapeIt(URL).then(currencies => {
        console.log(currencies.date)
        res.render('currency_table', currencies)
    })
    
})
app.listen(3000, () => console.log("Server starts at port 3000"))