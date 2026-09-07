const pug = require('pug')
const fs = require('fs-extra')
const glob = require('glob')
const rimraf = require('rimraf')
const { minify } = require('oxc-minify')

const { getCaps } = require('./caps')

async function minifyJS() {
  // Include lazyload first, then your app code
  const files = [
    'node_modules/lazyloadjs/build/lazyload.min.js',
    'public/themes.js',
    'public/index.js',
    'public/sort.js'
  ]
  
  const concatenated = files
    .map(f => fs.readFileSync(f, 'utf8'))
    .join('\n;\n') // Semicolon separator for safety
  
  // oxc-minify expects: minify(filename, sourceText, options)
  const result = await minify('app.js', concatenated, {
    compress: true,
    mangle: true
  })
  
  if (result.error) {
    console.error('Minification error:', result.error)
    process.exit(1)
  }
  
  fs.writeFileSync('build/app.min.js', result.code)
  console.log(`✓ Minified JS: ${concatenated.length} → ${result.code.length} bytes (${Math.round((1 - result.code.length/concatenated.length) * 100)}% reduction)`)
}

async function build() {
  rimraf.sync('build')
  fs.mkdirSync('build')
  
  // Render HTML in production mode
  const data = { ...getCaps(), production: true }
  fs.writeFileSync('build/index.html', pug.renderFile('views/index.pug', data))
  
  fs.copySync('images', 'build/images')
  fs.copySync('node_modules/reset-css/reset.css', 'build/reset.css')
  
  // Minify and concat JS (including lazyload)
  await minifyJS()
  
  // Copy service worker separately (NEVER bundle SW!)
  fs.copySync('public/sw.js', 'build/sw.js')
  
  // Copy other static files (except JS)
  const statics = glob.sync('public/*').filter(f => !f.endsWith('.js'))
  statics.forEach(file => fs.copySync(file, `build/${file.replace('public/', '')}`))
  
  console.log('✓ Build complete!')
}

build().catch(console.error)
