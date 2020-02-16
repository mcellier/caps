var express = require('express')
var glob = require('glob')
var path = require('path')
var app = express()

app.set('view engine', 'pug')

// FIXME zindex tooltop
// TODO css animations
// TODO export
// TODO update quantities per country in search
// TODO mentions légales
// TODO URL pushState (scroll, search)?
// TODO drag & drop select?
// TODO generate sw file to have the full list of things to cache?
// FIXME offline not working
// TODO put somewhere online 
// TODO put on github?
// TODO world map?
// TODO \n in data-attr
// TODO put back an arrow for tooltips?

// Statics
app.use(express.static(path.join(__dirname, 'public')))
app.use('/reset.css', express.static(path.join(__dirname, 'node_modules/reset-css/reset.css')))
app.use('/lazyload.js', express.static(path.join(__dirname, 'node_modules/lazyloadjs/build/lazyload.min.js')))
app.use('/images', express.static(path.join(__dirname, 'images')))

app.get('/', function (req, res) {
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

    //res.send(JSON.stringify(caps))

    res.render('index', { 
        caps,
        total: images.length,
        countries: Object.keys(caps).length - 1, // Remove unknown category
    })
})

var server = app.listen(process.env.PORT, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
