const pug = require('pug')
const fs = require('fs-extra')
const { globSync } = require('glob')
const rimraf = require('rimraf')
const { minify } = require('oxc-minify')
const { transform } = require('lightningcss')

const { getCaps } = require('./caps')

async function minifyJS() {
  // Include lazyload first, then your app code
  const files = [
    'node_modules/lazyloadjs/build/lazyload.min.js',
    'public/js/themes.js',
    'public/js/index.js',
    'public/js/sort.js'
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

function minifyCSS() {
  // Concatenate reset.css + our component CSS files in order
  const files = [
    'node_modules/reset-css/reset.css',
    'public/css/base.css',
    'public/css/header.css',
    'public/css/caps.css',
    'public/css/mentions.css',
    'public/css/footer.css'
  ]
  
  const concatenated = files
    .map(f => fs.readFileSync(f, 'utf8'))
    .join('\n')
  
  const result = transform({
    filename: 'style.css',
    code: Buffer.from(concatenated),
    minify: true,
    targets: {
      chrome: 95, // Modern browsers
    }
  })
  
  fs.writeFileSync('build/style.min.css', result.code)
  console.log(`✓ Minified CSS: ${concatenated.length} → ${result.code.length} bytes (${Math.round((1 - result.code.length/concatenated.length) * 100)}% reduction)`)
}

async function build() {
  rimraf.sync('build')
  fs.mkdirSync('build')
  fs.mkdirSync('build/js')
  
  // Render HTML in production mode
  const data = { ...getCaps(), production: true }
  fs.writeFileSync('build/index.html', pug.renderFile('views/index.pug', data))
  
  fs.copySync('images', 'build/images')
  
  // Minify and concat JS (including lazyload)
  await minifyJS()
  
  // Minify and concat CSS (including reset.css)
  minifyCSS()
  
  // Copy service worker separately (NEVER bundle SW!)
  fs.copySync('public/js/sw.js', 'build/js/sw.js')
  
  // Copy other static files (except JS and CSS)
  const statics = globSync('public/*').filter(f => !f.endsWith('.js') && !f.endsWith('.css'))
  statics.forEach(file => fs.copySync(file, `build/${file.replace('public/', '')}`))
  
  console.log('✓ Build complete!')
}

build().catch(console.error)
