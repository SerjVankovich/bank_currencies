//Libraries import
const { validationResult } = require('express-validator/check')

// Modules import
const URL = require('../config').API
const { scrapeIt } = require('../scrapper')

// Function which render page. If cerrency on client input was found render change page else render errors page
const validateCurrency = (currency, res, body, date) => {
    if (currency) {
        res.render('change', {...body, currency, date})
    } else {
        res.render('errors', { errors: [{
            value: body.code,
            msg: "There is no currency you input"
        }]})
    }
}

// Function which compare four strings
const findCurrency = (input, currency) => {
    const handledInput = input.toLowerCase().trim().replace(' ', '')

    const handledCurrencyCode = currency.code.toLowerCase().trim().replace(' ', '')
    const handledCurrencyCountry = currency.country.toLowerCase().trim().replace(' ', '')
    const handledCurrecyName = currency.currency.toLowerCase().trim().replace(' ', '')

    return handledInput === handledCurrecyName || handledInput === handledCurrencyCode || handledInput === handledCurrencyCountry

}

// High order controller
exports.changeController = LocalStorage => (req, res) => {
    const body = req.body

    // Validate req.body on errors
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.render('errors', {errors: errors.array()})
    }
    
    let currencies
    try {
        currencies = JSON.parse(LocalStorage.getItem('currencies'))
    } catch {}

    // If currencies found in LocalStorage render page
    if (currencies) {
        const currency = currencies.currencies.find(cur => findCurrency(body.code, cur))
        return validateCurrency(currency, res, body, currencies.date)
    }

    // If currencies not found in LocalStorage scrape data from BMO and render page
    scrapeIt(URL).then(currencies => {
        const currency = currencies.currencies.find(cur => findCurrency(body.code, cur))
        return validateCurrency(currency, res, body, currencies.date)
    }) 
}
