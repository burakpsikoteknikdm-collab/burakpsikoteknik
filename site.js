// Kaydırınca beliren öğeler
  (function(){
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function(el){ el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, {threshold: 0.12, rootMargin: '0px 0px -40px 0px'});
    els.forEach(function(el){ io.observe(el); });
  })();

  // Kaydırınca header gölgesi
  (function(){
    var h = document.querySelector('header'), ticking = false;
    function upd(){ h.classList.toggle('scrolled', window.scrollY > 40); ticking = false; }
    window.addEventListener('scroll', function(){ if (!ticking) { requestAnimationFrame(upd); ticking = true; } }, {passive:true});
    upd();
  })();

  // SSS açılır-kapanır yapısı
  document.querySelectorAll('.faq-question').forEach(item => {
    item.addEventListener('click', () => {
      const faqItem = item.parentElement;
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== faqItem) otherItem.classList.remove('active');
      });
      faqItem.classList.toggle('active');
    });
  });
