/* Foundry home page add-on.
   Adds an "Articles" link to the top bar and an "Insights" section
   (latest articles) just above "Get In Touch". The original home page
   is left exactly as it was built; this only adds to it.
   To publish a new article: add its folder under /articles/ and add
   one entry to articles/articles.json. Newest first. */
(function () {
  var base = 'articles/';

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function addNavLink() {
    var bar = document.querySelector('.nav-container');
    var cta = bar && bar.querySelector('.nav-cta');
    if (!bar || !cta || bar.querySelector('.nav-articles-link')) return !!bar;
    var a = el('a', 'nav-cta nav-articles-link', 'Articles');
    a.href = base;
    bar.insertBefore(a, cta);
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

  function start() {
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      var ready = document.querySelector('.nav-container') && document.getElementById('contact');
      if (ready || tries > 100) {
        clearInterval(timer);
        if (!ready) return;
        addNavLink();
        fetch(base + 'articles.json', { cache: 'no-cache' })
          .then(function (r) { return r.json(); })
          .then(addSection)
          .catch(function () {});
      }
    }, 50);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
