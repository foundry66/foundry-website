/* Foundry article pages: the animated gold mesh background and the
   navigation bar behaviour, copied from the main foundry.pm site so
   article pages look and move exactly like the home page. */
(function () {
  // Navigation: transparent at the top, dark and blurred once scrolled.
  var nav = document.querySelector('.foundry-nav');
  function setNav() {
    if (!nav) return;
    var on = window.scrollY > 40;
    nav.style.background = on ? 'rgba(13,12,10,0.92)' : 'transparent';
    nav.style.backdropFilter = on ? 'blur(12px)' : 'none';
    nav.style.webkitBackdropFilter = on ? 'blur(12px)' : 'none';
  }
  window.addEventListener('scroll', setNav, { passive: true });
  setNav();

  // Background mesh (same drawing as the home page).
  var canvas = document.getElementById('page-bg');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  var amp = mobile ? 0.6 : 1;
  var raf, hidden = false, t = 0, last = 0;
  var frame = 1000 / (mobile ? 30 : 60);
  var cell = 300;
  var grid = [], cols = 6, rows = 5, w = 0, h = 0, lastScroll = window.scrollY;
  var off = { x: 0, y: 0 }, vel = { x: 0, y: 0 };

  function rnd(n) { var v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); }

  function build(c, r) {
    var g = [];
    for (var y = 0; y <= r; y++) {
      g[y] = [];
      for (var x = 0; x <= c; x++) {
        var i = y * (c + 1) + x;
        var a = (rnd(i) - 0.5) * cell * 0.7, b = (rnd(i + 500) - 0.5) * cell * 0.7, k = 0.3;
        g[y][x] = {
          jx: a + b * k, jy: b + a * k,
          phX: rnd(i + 1000) * Math.PI * 2, phY: rnd(i + 2000) * Math.PI * 2,
          sensitivity: 0.7 + Math.random() * 0.6
        };
      }
    }
    return g;
  }

  function size() {
    var dpr = mobile ? Math.min(window.devicePixelRatio || 1, 1) : Math.min(window.devicePixelRatio || 1, 2);
    var sw = document.body.scrollWidth, sh = document.body.scrollHeight;
    cols = Math.ceil(sw / cell) + 2; rows = Math.ceil(sh / cell) + 2;
    if (mobile) { cols = Math.max(3, Math.ceil(cols / 2)); rows = Math.max(3, Math.ceil(rows / 2)); }
    w = sw; h = sh;
    canvas.width = sw * dpr; canvas.height = sh * dpr;
    canvas.style.width = sw + 'px'; canvas.style.height = sh + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    grid = build(cols, rows);
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(212,175,55,0.18)';
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 1;
    var p = [];
    for (var y = 0; y <= rows; y++) {
      p[y] = [];
      for (var x = 0; x <= cols; x++) {
        var n = grid[y][x], bx = x / cols * w, by = y / rows * h;
        p[y][x] = {
          x: bx + n.jx + Math.sin(t + n.phX) * 20 * amp + off.x * n.sensitivity,
          y: by + n.jy + Math.cos(t * 1.2 + n.phY) * 18 * amp + off.y * n.sensitivity
        };
      }
    }
    for (var yy = 0; yy < rows; yy++) {
      for (var xx = 0; xx < cols; xx++) {
        var A = p[yy][xx], B = p[yy][xx + 1], C = p[yy + 1][xx], D = p[yy + 1][xx + 1];
        var id = yy * cols + xx;
        var u = 0.5 + (rnd(id + 3000) - 0.5) * 0.5, v = 0.5 + (rnd(id + 4000) - 0.5) * 0.5;
        var cx = A.x * (1 - u) * (1 - v) + B.x * u * (1 - v) + C.x * (1 - u) * v + D.x * u * v;
        var cy = A.y * (1 - u) * (1 - v) + B.y * u * (1 - v) + C.y * (1 - u) * v + D.y * u * v;
        var edges = [[A, B], [B, D], [D, C], [C, A]];
        for (var e = 0; e < 4; e++) {
          ctx.beginPath();
          ctx.moveTo(edges[e][0].x, edges[e][0].y);
          ctx.lineTo(cx, cy);
          ctx.lineTo(edges[e][1].x, edges[e][1].y);
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
  }

  function tick(now) {
    if (!hidden) {
      var d = now - last;
      if (d >= frame) {
        last = now - d % frame;
        t += 0.018;
        off.x += (vel.x - off.x) * 0.06; off.y += (vel.y - off.y) * 0.06;
        vel.x *= 0.82; vel.y *= 0.82;
        off.x = Math.max(-60, Math.min(60, off.x)); off.y = Math.max(-80, Math.min(80, off.y));
        draw();
      }
    }
    raf = requestAnimationFrame(tick);
  }

  function onScroll() {
    var d = window.scrollY - lastScroll;
    lastScroll = window.scrollY;
    vel.y += d * 1.8; vel.x += d * 0.4;
  }

  size();
  setTimeout(function () { size(); if (reduce) draw(); }, 300);
  window.addEventListener('load', function () { size(); if (reduce) draw(); });
  if (reduce) { draw(); return; }
  document.addEventListener('visibilitychange', function () { hidden = document.hidden; });
  window.addEventListener('resize', function () { size(); });
  if (!mobile) window.addEventListener('scroll', onScroll, { passive: true });
  raf = requestAnimationFrame(tick);
})();
