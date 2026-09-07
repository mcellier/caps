function sortByDefault(a, b) {
  if (a.country < b.country) {
    return -1
  }
  if (a.country > b.country) {
    return 1
  }
  return 0
}

function sortByCapsDesc(a, b) {
  if (parseInt(a.total, 10) < parseInt(b.total, 10)) {
    return 1
  }
  if (parseInt(a.total, 10) > parseInt(b.total, 10)) {
    return -1
  }
  return 0
}

function sortByCapsAsc(a, b) {
  if (parseInt(a.total, 10) < parseInt(b.total, 10)) {
    return -1
  }
  if (parseInt(a.total, 10) > parseInt(b.total, 10)) {
    return 1
  }
  return 0
}

const SORT_OPTIONS = [sortByDefault, sortByCapsDesc, sortByCapsAsc]
const SORT_LABELS = ['↑ ABC', '↓ Caps', '↑ Caps']
let SORT_CURRENT = 0

function updateButtonSortLabel() {
  const button = document.querySelector('button.sort')
  button.innerHTML = SORT_LABELS[SORT_CURRENT]
}

function sort() {
  // Looping through available sorting options
  SORT_CURRENT = (SORT_CURRENT === SORT_OPTIONS.length - 1) ? 0 : SORT_CURRENT + 1

  let countries = Array.from(document.querySelectorAll('.country')).map(el => ({ 
    country: el.getAttribute('data-country'), 
    total: el.getAttribute('data-total') 
  }))

  countries.sort(SORT_OPTIONS[SORT_CURRENT])

  countries.forEach((country, index) => {
    document.querySelector(`.country[data-country="${country.country}"]`).style.order = index
  })

  updateButtonSortLabel()
}

updateButtonSortLabel()