document.getElementById('lang-toggle').addEventListener('click', function () {
  const currentLang = this.textContent;
  const newLang = currentLang === 'EN' ? 'VI' : 'EN';
  this.textContent = newLang;

  const elementsVi = document.querySelectorAll('[data-lang="vi"]');
  const elementsEn = document.querySelectorAll('[data-lang="en"]');

  if (newLang === 'VI') {
    elementsVi.forEach(el => el.style.display = 'block');
    elementsEn.forEach(el => el.style.display = 'none');
  } else {
    elementsVi.forEach(el => el.style.display = 'none');
    elementsEn.forEach(el => el.style.display = 'block');
  }
});
