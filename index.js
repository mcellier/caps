var express = require('express')
var path = require('path')
var app = express()

var { getCaps } = require('./caps')

app.set('view engine', 'pug')

// TODO css animations
// TODO export
// TODO update quantities per country in search
// TODO generate sw file to have the full list of things to cache?
// FIXME offline not working
// TODO world map?
// TODO \n in data-attr
// TODO put back an arrow for tooltips?
// TODO hide brewery name if same than beer (generic)

// Statics
app.use(express.static(path.join(__dirname, 'public')))
app.use('/reset.css', express.static(path.join(__dirname, 'node_modules/reset-css/reset.css')))
app.use('/lazyload.js', express.static(path.join(__dirname, 'node_modules/lazyloadjs/build/lazyload.min.js')))
app.use('/images', express.static(path.join(__dirname, 'images')))

app.get('/', function (req, res) {
    res.render('index', getCaps())
})

var server = app.listen(process.env.PORT, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
