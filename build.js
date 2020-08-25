const pug = require('pug')
const fs = require('fs-extra')
const glob = require('glob')
const rimraf = require('rimraf')

const { getCaps } = require('./caps')

rimraf.sync('build')
fs.mkdirSync('build')
fs.writeFileSync('build/index.html', pug.renderFile('views/index.pug', getCaps()))
fs.copySync('images', 'build/images')
fs.copySync('node_modules/reset-css/reset.css', 'build/reset.css')
fs.copySync('node_modules/lazyloadjs/build/lazyload.min.js', 'build/lazyload.js')

const statics = glob.sync('public/*')
statics.forEach((file) => fs.copySync(file, 'build/' + file.replace('public/', '')))
