/* Foundry home page add-on.
   Adds an "Articles" link to the top bar and an "Insights" section
   (latest articles) just above "Get In Touch". The original home page
   is left exactly as it was built; this only adds to it.
   To publish a new article: add its folder under /articles/ and add
   one entry to articles/articles.json. Newest first. */
(function () {
  var base = 'articles/';
  var CALC = 'https://student-housing-apraisal.foundry.pm/';

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  var LOGO = "<svg class=\"nav-logo-mark\" viewBox=\"196 196 208 208\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M218.3 260.26L232.89 239.18L250.79 223.56L269.77 215.83L295.78 211.14L317.93 211.78L339.46 219.37L358.14 230.33L374.73 248.69L385.62 270.63L389.56 291.93L388.11 318.37L380.45 339.34L368.6 357L351.47 372.81L330.98 385.37L305.8 389.13L283.18 388.86L261.12 380.19L241.89 369.63L223.68 349.09L213.46 328.38L211.13 307.89L211.99 281.5Z\" stroke=\"#9A7B3F\" stroke-width=\"1\" fill=\"none\" opacity=\"0.35\"/><circle cx=\"218.3\" cy=\"260.26\" r=\"7.28\" fill=\"#D4B469\"/><circle cx=\"232.89\" cy=\"239.18\" r=\"5.73\" fill=\"#E8E4DC\"/><circle cx=\"250.79\" cy=\"223.56\" r=\"3.53\" fill=\"#9A7B3F\"/><circle cx=\"269.77\" cy=\"215.83\" r=\"4.92\" fill=\"#9A7B3F\"/><circle cx=\"295.78\" cy=\"211.14\" r=\"6.55\" fill=\"#9A7B3F\"/><circle cx=\"317.93\" cy=\"211.78\" r=\"5.58\" fill=\"#D4B469\"/><circle cx=\"339.46\" cy=\"219.37\" r=\"3.74\" fill=\"#D4B469\"/><circle cx=\"358.14\" cy=\"230.33\" r=\"9.02\" fill=\"#9A7B3F\"/><circle cx=\"374.73\" cy=\"248.69\" r=\"5.05\" fill=\"#D4B469\"/><circle cx=\"385.62\" cy=\"270.63\" r=\"7.3\" fill=\"#D4B469\"/><circle cx=\"389.56\" cy=\"291.93\" r=\"6.49\" fill=\"#E8E4DC\"/><circle cx=\"388.11\" cy=\"318.37\" r=\"5.84\" fill=\"#9A7B3F\"/><circle cx=\"380.45\" cy=\"339.34\" r=\"4.76\" fill=\"#D4B469\"/><circle cx=\"368.6\" cy=\"357\" r=\"4.85\" fill=\"#D4B469\"/><circle cx=\"351.47\" cy=\"372.81\" r=\"3.09\" fill=\"#D4B469\"/><circle cx=\"330.98\" cy=\"385.37\" r=\"6.11\" fill=\"#9A7B3F\"/><circle cx=\"305.8\" cy=\"389.13\" r=\"7.43\" fill=\"#9A7B3F\"/><circle cx=\"283.18\" cy=\"388.86\" r=\"7.18\" fill=\"#E8E4DC\"/><circle cx=\"261.12\" cy=\"380.19\" r=\"7.81\" fill=\"#9A7B3F\"/><circle cx=\"241.89\" cy=\"369.63\" r=\"3.49\" fill=\"#9A7B3F\"/><circle cx=\"223.68\" cy=\"349.09\" r=\"6.67\" fill=\"#9A7B3F\"/><circle cx=\"213.46\" cy=\"328.38\" r=\"7.47\" fill=\"#9A7B3F\"/><circle cx=\"211.13\" cy=\"307.89\" r=\"3.47\" fill=\"#D4B469\"/><circle cx=\"211.99\" cy=\"281.5\" r=\"5.63\" fill=\"#D4B469\"/></svg><span class=\"nav-logo-text\">FOUNDRY<span class=\"nav-logo-pm\">.PM</span></span>";

  function addLogo() {
    var bar = document.querySelector('.nav-container');
    var word = bar && bar.querySelector('.nav-wordmark');
    if (!word || bar.querySelector('.nav-logo')) return;
    var a = el('a', 'nav-logo');
    a.href = './';
    a.setAttribute('aria-label', 'Foundry home');
    a.innerHTML = LOGO;
    bar.insertBefore(a, word);
    bar.classList.add('has-logo');
  }

  function addNavLink() {
    var bar = document.querySelector('.nav-container');
    var cta = bar && bar.querySelector('.nav-cta');
    if (!bar || !cta || bar.querySelector('.nav-articles-link')) return !!bar;
    var a = el('a', 'nav-cta nav-articles-link', 'Articles');
    a.href = base;
    bar.insertBefore(a, cta);
    var c = el('a', 'nav-cta nav-calc-link', 'Calculator');
    c.href = CALC;
    c.target = '_blank';
    c.rel = 'noopener';
    bar.insertBefore(c, a);
    return true;
  }

  function addSection(list) {
    var contact = document.getElementById('contact');
    if (!contact || document.getElementById('insights') || !list.length) return;
    var sec = el('section', 'section');
    sec.id = 'insights';
    var box = el('div', 'section-container content-halo');
    var div = el('span', 'section-divider'); div.setAttribute('aria-hidden', 'true');
    box.appendChild(div);
    box.appendChild(el('p', 'section-label', 'INSIGHTS'));
    box.appendChild(el('h2', 'section-headline', 'Thinking on Development'));
    var grid = el('div', 'cards-grid insights-grid');
    list.slice(0, 2).forEach(function (item) {
      var card = el('a', 'party-card content-halo insights-card');
      card.href = base + item.slug + '/';
      card.appendChild(el('span', 'card-num', item.series));
      card.appendChild(el('h3', 'card-title', item.title));
      card.appendChild(el('p', 'card-body', item.summary));
      card.appendChild(el('span', 'insights-read', 'Read the essay →'));
      var line = el('div', 'card-line'); line.setAttribute('aria-hidden', 'true');
      card.appendChild(line);
      grid.appendChild(card);
    });
    box.appendChild(grid);
    var more = el('div', 'insights-more');
    var all = el('a', 'btn-secondary', 'All articles');
    all.href = base;
    more.appendChild(all);
    box.appendChild(more);
    sec.appendChild(box);
    contact.parentNode.insertBefore(sec, contact);
    // Let the background mesh resize to the new page height.
    window.dispatchEvent(new Event('resize'));
  }

  function addTool() {
    var contact = document.getElementById('contact');
    if (!contact || document.getElementById('tools')) return;
    var sec = el('section', 'section');
    sec.id = 'tools';
    var box = el('div', 'section-container content-halo');
    var div = el('span', 'section-divider'); div.setAttribute('aria-hidden', 'true');
    box.appendChild(div);
    box.appendChild(el('p', 'section-label', 'TOOLS'));
    box.appendChild(el('h2', 'section-headline', 'Student Housing Appraisal'));
    var card = el('div', 'party-card content-halo tool-card');
    card.appendChild(el('p', 'card-body', 'Test a purpose-built student accommodation scheme in minutes. Model land, build cost, rents and exit yield, and see whether the numbers work before any design starts.'));
    var go = el('a', 'btn-primary tool-btn', 'Open the calculator');
    go.href = CALC; go.target = '_blank'; go.rel = 'noopener';
    card.appendChild(go);
    box.appendChild(card);
    sec.appendChild(box);
    var ins = document.getElementById('insights');
    contact.parentNode.insertBefore(sec, ins || contact);
    window.dispatchEvent(new Event('resize'));
  }

  function start() {
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      var ready = document.querySelector('.nav-container') && document.getElementById('contact');
      if (ready || tries > 100) {
        clearInterval(timer);
        if (!ready) return;
        addLogo();
        addNavLink();
        fetch(base + 'articles.json', { cache: 'no-cache' })
          .then(function (r) { return r.json(); })
          .then(addSection)
          .catch(function () {})
          .then(addTool);
      }
    }, 50);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
