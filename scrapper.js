const puppeteer = require('puppeteer')

async function scrapeIt(url) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto(url)

    const currencies = await page.evaluate(() => {
        const countries = []
        const currencies = []
        const codes = []
        const buy = []
        const sell = []
        $('td.country-col').each(function() {
            countries.push($(this).text().trim())
        })
        $('td.currency-col').each(function() {
            const currency = $(this).text().trim()
            const reg = /\(\w+\)/
            const code = currency.match(reg)[0].slice(1, 4)
            codes.push(code)
            currencies.push(currency)
        })
        $('td.buy-col').each(function() {
            buy.push(parseFloat($(this).text().trim()))
        })
        $('td.sell-col').each(function() {
            sell.push(parseFloat($(this).text().trim()))
        })

        const date = $('p.first.bold').text()

        const result = { 
            currencies: countries.map((country, i) => ({
                country,
                currency: currencies[i],
                buy: buy[i],
                sell: sell[i],
                code: codes[i]
            })),
            date: date.slice(0, 18) + date.slice(45)

    }
    
        return result
    })

    
    return currencies

}

module.exports = {
    scrapeIt
}