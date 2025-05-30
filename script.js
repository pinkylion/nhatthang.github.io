function toggleLanguage() {
  const current = document.getElementById('lang-toggle').innerText;
  const viElements = document.querySelectorAll('[data-lang="vi"]');
  const enElements = document.querySelectorAll('[data-lang="en"]');

  if (current === 'EN') {
    viElements.forEach(el => el.style.display = 'none');
    enElements.forEach(el => el.style.display = '');
    document.getElementById('lang-toggle').innerText = 'VI';
  } else {
    enElements.forEach(el => el.style.display = 'none');
    viElements.forEach(el => el.style.display = '');
    document.getElementById('lang-toggle').innerText = 'EN';
  }
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
}

setTimeout(() => {
  document.getElementById('popup').style.display = 'flex';
}, 5000);
