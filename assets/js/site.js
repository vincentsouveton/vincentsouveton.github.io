// Small helpers for the site: light/dark switch and the e-mail button.
(function () {
  var root = document.documentElement;

  // ---- Light / dark mode -------------------------------------------------
  // Follows the visitor's system setting until they press the button;
  // their choice is then remembered in the browser.
  function currentTheme() {
    var t = root.getAttribute('data-theme');
    if (t === 'dark' || t === 'light') return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  var themeBtn = document.getElementById('theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('vs-theme', next); } catch (e) {}
    });
  }

  // ---- E-mail button -----------------------------------------------------
  // The address is stored reversed in two attributes, so it never appears in
  // the page source. On click it is rebuilt, shown and copied.
  var mailBtn = document.getElementById('email-btn');
  var mailLabel = document.getElementById('email-label');
  if (mailBtn && mailLabel) {
    mailBtn.addEventListener('click', function () {
      function rev(s) { return s.split('').reverse().join(''); }
      var addr = rev(mailBtn.dataset.u) + String.fromCharCode(64) + rev(mailBtn.dataset.d);
      function show() { mailLabel.textContent = addr; }
      function select() {
        var r = document.createRange(); r.selectNodeContents(mailLabel);
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      }
      show();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr).then(function () {
          mailLabel.textContent = 'Copied ✓';
          setTimeout(show, 1400);
        }, select);
      } else {
        select();
      }
    });
  }
})();
