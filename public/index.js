if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
};

const CLASSNAME_IS_CAP_SELECTED = 'got-this-one'
const CLASSNAME_HAS_CAP_SELECTED = 'got-these'
const CLASSNAME_HIDDEN = 'hidden'

function toggleGotThisOne(el) {
    el.classList.toggle(CLASSNAME_IS_CAP_SELECTED);
    toggleGotThese();
}

function toggleGotThese() {
    const element = document.querySelector(`.${CLASSNAME_HAS_CAP_SELECTED}`);
    const caps = document.querySelectorAll(`.${CLASSNAME_IS_CAP_SELECTED}`).length;
    element.querySelector('span').innerHTML = `${caps} capsule(s) sélectionnée(s)`;
    element.classList.toggle(CLASSNAME_HIDDEN, caps === 0);
}

function clearGotThese() {
  document.querySelectorAll(`.${CLASSNAME_IS_CAP_SELECTED}`).forEach(element => {
    element.classList.remove(CLASSNAME_IS_CAP_SELECTED)
  })

  toggleGotThese()
}

function search() {
    const value = document.querySelector('.search input').value.toLowerCase();

    if (! value) {
        document.querySelectorAll('li').forEach(element => {
            element.classList.remove(CLASSNAME_HIDDEN);
        })
    } else {
        document.querySelectorAll('li').forEach((element) => {
            const match = element.querySelector('p').innerText.toLowerCase().includes(value);
            element.classList.toggle(CLASSNAME_HIDDEN, !match);
        })
    }

    document.querySelectorAll('.country').forEach(element => {
        const hasCaps = element.querySelectorAll(`li:not(.${CLASSNAME_HIDDEN})`).length;
        element.classList.toggle(CLASSNAME_HIDDEN, !hasCaps)
    })

    document.querySelector('.search a').classList.toggle('hidden', !value)
}

function clearSearch() {
  document.querySelector('.search input').value = ''
  search()
}
