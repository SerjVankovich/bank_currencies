const { scrapeIt } = require('../scrapper')
const URL = require('../config').API

exports.mainController = LocalStorage => (req, res) => {
    let currencies
    try {
        currencies = JSON.parse(LocalStorage.getItem('currencies'))
    } catch {}
   
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
    scrapeIt(URL)
        .then(currencies => {
            LocalStorage.setItem('currencies', JSON.stringify(currencies))
            res.render('currency_table', currencies)
        })
        .catch(err => console.log(err))
    
}