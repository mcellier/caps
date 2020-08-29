var glob = require('glob')

module.exports = {
  getCaps: () => {
    const images = glob.sync('images/**/**/*.*')
    const caps = {}

    images.forEach(image => {
        const [ basePath, country, brewery, name ] = image.split('/')

        if (!Object.keys(caps).includes(country)) {
            caps[country] = {
                name: country,
                total: 0,
                breweries: {},
            }
        }
        if (!Object.keys(caps[country].breweries).includes(brewery)) {
            caps[country].breweries[brewery] = {
                name: brewery,
                beers: [],
            }
        }

        const cleanName = name && name.split('.').shift().replace(/\(.*\)$/, '').trim()
        const tags = name && name.match(/\(.*\)/)
        const cleanTags = tags && tags[0].replace('(', '').replace(')', '')

        caps[country].total++
        caps[country].breweries[brewery].beers.push({
            image,
            name: cleanName,
            tags: cleanTags,
        })
    })

    return {
      caps,
      total: images.length,
      countries: Object.keys(caps).length - 2, // Remove unknown + non beer categories
    }
  }
}
