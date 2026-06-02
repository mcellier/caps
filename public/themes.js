const THEMES = {
  blond: {
    name: 'Bière Blonde',
    emoji: '🍺',
    logo: 'logo-blond.svg',
    colors: {
      bg: '#F5CB70',
      main: '#6b5931',
      text: '#3B3B3B'
    }
  },
  dark: {
    name: 'Bière Brune',
    emoji: '🍻',
    logo: 'logo-dark.svg',
    colors: {
      bg: '#2C1810',
      main: '#8B6F47',
      text: '#E8D5C4'
    }
  },
  white: {
    name: 'Bière Blanche',
    emoji: '🥛',
    logo: 'logo-white.svg',
    colors: {
      bg: '#F5F1E8',
      main: '#D4A574',
      text: '#5C4A3A'
    }
  },
  amber: {
    name: 'Bière Ambrée',
    emoji: '🧡',
    logo: 'logo-amber.svg',
    colors: {
      bg: '#E8934A',
      main: '#6B3E1E',
      text: '#2A1810'
    }
  },
  red: {
    name: 'Bière Rousse',
    emoji: '❤️',
    logo: 'logo-red.svg',
    colors: {
      bg: '#A84432',
      main: '#522319',
      text: '#F5E8D5'
    }
  }
}

// Theme switching
function setTheme(themeName) {
  const theme = THEMES[themeName]
  if (!theme) return

  // Update CSS variables
  document.documentElement.style.setProperty('--main-bg-color', theme.colors.bg)
  document.documentElement.style.setProperty('--main-color', theme.colors.main)
  document.documentElement.style.setProperty('--text-color', theme.colors.text)

  // Update logo
  const logoImg = document.querySelector('header img')
  if (logoImg) {
    logoImg.src = theme.logo
  }

  // Update PWA theme color
  const metaTheme = document.querySelector('meta[name="theme-color"]')
  if (metaTheme) {
    metaTheme.content = theme.colors.bg
  }

  // Update mask-icon color
  const maskIcon = document.querySelector('link[rel="mask-icon"]')
  if (maskIcon) {
    maskIcon.setAttribute('color', theme.colors.bg)
  }

  // Update msapplication-TileColor
  const msTile = document.querySelector('meta[name="msapplication-TileColor"]')
  if (msTile) {
    msTile.content = theme.colors.bg
  }

  // Update theme selector to reflect current theme
  const selector = document.getElementById('theme-selector')
  if (selector) {
    selector.value = themeName
  }

  // Save preference
  localStorage.setItem('beer-theme', themeName)
}

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', function() {
  const savedTheme = localStorage.getItem('beer-theme') || 'blond'
  setTheme(savedTheme)
})
