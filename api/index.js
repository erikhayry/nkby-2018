const fetch = require('node-fetch')

module.exports = async () => {
    const request = await fetch('https://api.github.com/orgs/zeit/members')
    const data = await request.json()

    return data
}