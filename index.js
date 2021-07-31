require('dotenv').config()
const cliSelect = require('cli-select')
const fs = require('fs')
const chalk = require('chalk')

if (!process.env.DISCORD_AUTH_TOKEN) {
    return console.error('No token was provided.')
}

console.clear()
console.log('Please select a a file to run:')
cliSelect({
    values: fs.readdirSync('./examples'),
    valueRenderer: (value, selected) => {
        if (selected) {
            value = chalk.yellowBright(value)
            return chalk.underline(value)
        }
        return value
    }
}).then(selected => {
    console.clear()
    require(`./examples/${selected.value}`)
})