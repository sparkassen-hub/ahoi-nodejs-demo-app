
const addLanguageSwitcherListener = () => {
  const lang = localStorage.getItem('lang') || 'de';
  const removables = document.querySelectorAll(`body [lang]:not([lang='${lang}'])`);
  if(removables) {
    for(const removable of removables) {
      removable.remove();
    }
  }

  const langswitchLinks = document.querySelectorAll('a[switchlang]');
  for (const langswitchLink of langswitchLinks) {
    langswitchLink.addEventListener('click', (event) => {
      event.preventDefault();
      const link = event.target;
      localStorage.setItem('lang', link.getAttribute('switchlang').toLowerCase());
      location.reload();
      return false;
    });
  }
}

const initLanguageSwitcher = () => {
  const lang = localStorage.getItem('lang') || 'de';
  const styleEl = document.createElement('style');
  document.head.appendChild(styleEl);
  const styleSheet = styleEl.sheet;
  styleSheet.insertRule(`body [lang]:not([lang='${lang}']){display:none !important;}`, 0);

  document.addEventListener("DOMContentLoaded", addLanguageSwitcherListener);
}
initLanguageSwitcher();

