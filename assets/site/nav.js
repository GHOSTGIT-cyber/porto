// Menu commun (burger, « Services », page courante), barre de lecture et année du pied de page.
(function(){
  var h = document.getElementById('gh');
  if (h){
    var burger = document.getElementById('ghBurger'), menu = document.getElementById('ghMenu');
    var dd = h.querySelector('.gh-dd'), ddBtn = dd.querySelector('button');
    function closeAll(){
      menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false');
      dd.classList.remove('open'); ddBtn.setAttribute('aria-expanded', 'false');
    }
    burger.addEventListener('click', function(){
      var o = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', o);
      burger.textContent = o ? '✕' : '☰';
    });
    ddBtn.addEventListener('click', function(){
      ddBtn.setAttribute('aria-expanded', dd.classList.toggle('open'));
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ closeAll(); burger.textContent = '☰'; });
    });
    document.addEventListener('click', function(e){
      if (!dd.contains(e.target) && !burger.contains(e.target) && !menu.classList.contains('open')) dd.classList.remove('open');
    });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape'){ closeAll(); burger.textContent = '☰'; } });

    // Page courante
    var here = location.pathname.replace(/index\.html$/, '');
    h.querySelectorAll('a[href]').forEach(function(a){
      if (a.getAttribute('href') === here && here !== '/'){
        a.setAttribute('aria-current', 'page');
        if (dd.contains(a)) ddBtn.classList.add('cur');
      }
    });

    // Barre de lecture + ombre de l'en-tête au défilement
    var bar = document.createElement('div');
    bar.id = 'ghProgress'; bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var ticking = false;
    function update(){
      var max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(scrollY / max, 1) : 0) + ')';
      h.classList.toggle('scrolled', scrollY > 8);
      ticking = false;
    }
    addEventListener('scroll', function(){ if (!ticking){ ticking = true; requestAnimationFrame(update); } }, {passive:true});
    addEventListener('resize', update);
    update();
  }
  document.querySelectorAll('[data-year]').forEach(function(el){ el.textContent = new Date().getFullYear(); });
})();
