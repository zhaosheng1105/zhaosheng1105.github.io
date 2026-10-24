(function () {
  const url = new URL(window.location.href);
  const english = url.pathname.includes('/en/');
  const requested = url.searchParams.get('lang');
  const filename = url.pathname.endsWith('research.html') ? 'research.html' : url.pathname.endsWith('honors.html') ? 'honors.html' : 'index.html';
  const legacySection = url.hash.slice(1);
  let target = filename;
  if (filename === 'index.html' && ['projects', 'publications', 'patents'].includes(legacySection)) target = 'research.html';
  if (filename === 'index.html' && legacySection === 'honors') target = 'honors.html';
  if (requested === 'en' && !english) target = 'en/' + target;
  if (requested === 'zh-CN' && english) target = '../' + target;
  if (target !== filename) {
    url.searchParams.delete('lang');
    window.location.replace(target + url.search + url.hash);
  }
})();
