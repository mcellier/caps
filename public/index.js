if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
};

const CLASSNAME_HIDDEN = 'hidden'

function search() {
    const value = document.querySelector('.search input').value.toLowerCase();

    if (! value) {
        document.querySelectorAll('li').forEach(element => {
            element.classList.remove(CLASSNAME_HIDDEN);
        })
    } else {
        document.querySelectorAll('li').forEach((element) => {
            const text = ''
              + element.getAttribute('data-beer')
              + element.getAttribute('data-brewery')
              + element.getAttribute('data-tags')
              + element.getAttribute('data-country')
            const match = text.toLowerCase().includes(value);
            element.classList.toggle(CLASSNAME_HIDDEN, !match);
        })
    }

    document.querySelectorAll('.country').forEach(element => {
        const capsCount = element.querySelectorAll(`li:not(.${CLASSNAME_HIDDEN})`).length;
        // Update country caps count
        element.querySelector('h2 button').innerHTML = element.querySelector('h2 button').innerHTML.replace(/\(.*\)/, `(${capsCount})`);
        // Hide country if no caps matching the search
        element.classList.toggle(CLASSNAME_HIDDEN, capsCount === 0);
    })
}

function clearSearch() {
  document.querySelector('.search input').value = ''
  document.querySelector('.search input').focus()
  search()
}

function showLegalMentions() {
  document.querySelector('aside').classList.remove('hidden')
}

function hideLegalMentions() {
  document.querySelector('aside').classList.add('hidden')
}

function toggleCountry(countryName) {
  document.querySelector(`[data-country='${countryName}'] ul`).classList.toggle(CLASSNAME_HIDDEN)
}
