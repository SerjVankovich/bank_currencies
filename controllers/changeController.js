const { validationResult } = require('express-validator/check')
const { scrapeIt } = require('../scrapper')
const URL = require('../config').API

const validateCurrency = (currency, res, body) => {
    if (currency) {
        res.render('change', {...body, currency})
    } else {
        res.render('errors', { errors: [{
            value: body.code,
            msg: "There is no currency you input"
        }]})
    }
}

const findCurrency = (input, currency) => {
    const handledInput = input.toLowerCase().trim().replace(' ', '')

    const handledCurrencyCode = currency.code.toLowerCase().trim().replace(' ', '')
    const handledCurrencyCountry = currency.country.toLowerCase().trim().replace(' ', '')
    const handledCurrecyName = currency.currency.toLowerCase().trim().replace(' ', '')

    return handledInput === handledCurrecyName || handledInput === handledCurrencyCode || handledInput === handledCurrencyCountry

}

exports.changeController = LocalStorage => (req, res) => {
    const body = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.render('errors', {errors: errors.array()})
    }

    const currencies = JSON.parse(LocalStorage.getItem('currencies'))

    if (currencies) {
        const currency = currencies.currencies.find(cur => findCurrency(body.code, cur))
        return validateCurrency(currency, res, body)
    }

    scrapeIt(URL).then(currencies => {
        const currency = currencies.currencies.find(cur => findCurrency(body.code, cur))
        return validateCurrency(currency, res, body)
    })
    
}