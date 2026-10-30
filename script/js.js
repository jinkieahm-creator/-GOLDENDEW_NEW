/* GOLDEN DEW 리뉴얼 — 상품 렌더링 · 슬라이더 · 하트 클릭 · GSAP 연출
   1.데이터  2.카드 렌더·탭·레일  3.하트 클릭  4.헤더  5.슬라이더들  6.GSAP 연출
   ※ GSAP 이 로드되지 않아도 1~5(기본 기능)는 정상 동작합니다. */
(function () {
  'use strict';

  var g = window.gsap;
  var ST = window.ScrollTrigger;
  if (g && ST) g.registerPlugin(ST);
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
  var anim = !!g && !reduce;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var lenis = null;   // 부드러운 휠 스크롤(Lenis) — 6-0 에서 켭니다

  /* ===== 1. 데이터 (시안 문구 기준 · 실제 상품명/가격으로 교체하세요) ===== */
  var P = function (n, p, img, t) { return { n: n, p: p, img: 'img/product/' + img + '.jpg', t: t }; };
  var best = [
    P('밀시피아뽀띠 귀고리', 990000, 'earring-01', 'earring'),
    P('리레토2(D) 팬던트(체인제외)', 1930000, 'pendant-01', 'necklace'),
    P('두이타닐스3(S) 펜던트(체인제외)', 590000, 'pendant-02', 'necklace'),
    P('밀시피아뽀띠2(D) 펜던트(체인제외)', 740000, 'pendant-03', 'necklace')
  ];
  var fresh = [
    P('허니콤 로즈 펜던트(체인제외)', 1280000, 'pendant-05', 'necklace'),
    P('클로버 골드 팔찌', 1150000, 'bracelet-03', 'bracelet'),
    P('레이스 다이아 반지', 4860000, 'ring-04', 'ring'),
    P('블룸 다이아 귀걸이', 3240000, 'earring-03', 'earring')
  ];
  var love = [
    P('로닝듀2(M6)3C(D) 반지', 3490000, 'love-ring-01', 'ring'),
    P('리보세트2(3C) 목걸이', 2950000, 'pendant-03', 'necklace'),
    P('로닝듀2(형터치) 귀고리', 1810000, 'love-earring-01', 'earring'),
    P('로닝듀2(M6)5C 반지', 6230000, 'love-ring-02', 'ring'),
    P('라인 다이아 반지', 1690000, 'ring-03', 'ring'),
    P('플로라 다이아 귀걸이', 5980000, 'earring-02', 'earring'),
    P('티어드롭 펜던트(체인제외)', 790000, 'pendant-04', 'necklace'),
    P('로즈골드 플라워 팔찌', 1380000, 'bracelet-02', 'bracelet')
  ];
  var today = [
    P('반시피아뽀띠2(D) 펜던트(체인제외)', 740000, 'tb-pendant-01', 'necklace'),
    P('반시피아뽀띠1 펜던트(체인제외)', 430000, 'tb-pendant-02', 'necklace'),
    P('반시피아뽀띠(D) 반지', 2430000, 'tb-ring-01', 'ring'),
    P('반시피아뽀띠2(D) 팔찌', 2750000, 'tb-bracelet-01', 'bracelet'),
    P('밀시피아뽀띠 귀고리', 990000, 'earring-01', 'earring'),
    P('블룸 다이아 귀걸이', 3240000, 'earring-03', 'earring'),
    P('플로라 다이아 귀걸이', 5980000, 'earring-02', 'earring'),
    P('로닝듀2(형터치) 귀고리', 1810000, 'love-earring-01', 'earring'),
    P('레이스 다이아 반지', 4860000, 'ring-04', 'ring'),
    P('라인 다이아 반지', 1690000, 'ring-03', 'ring'),
    P('골드 링크 팔찌', 1990000, 'bracelet-04', 'bracelet'),
    P('클로버 골드 팔찌', 1150000, 'bracelet-03', 'bracelet'),
    P('로즈골드 플라워 팔찌', 1380000, 'bracelet-02', 'bracelet'),
    P('허니콤 로즈 펜던트(체인제외)', 1280000, 'pendant-05', 'necklace'),
    P('허니콤 미니 펜던트(체인제외)', 880000, 'pendant-06', 'necklace'),
    P('티어드롭 펜던트(체인제외)', 790000, 'pendant-04', 'necklace')
  ];
  var won = function (v) { return v.toLocaleString('ko-KR') + '원'; };

  /* ===== 2. 카드 렌더 · 탭 · 레일 ===== */
  function card(it, i, rank) {
    return '<li><article class="card"><span class="no" ' + (rank ? '' : 'hidden') + '>' + (i + 1) + '</span>' +
      '<button class="heart" type="button" aria-pressed="false" aria-label="' + it.n + ' 위시리스트 담기"><svg><use href="#i-heart"/></svg></button>' +
      '<div class="thumb"><img src="' + it.img + '" alt="' + it.n + '" loading="lazy" decoding="async" width="800" height="800"></div>' +
      '<h3>' + it.n + '</h3><p class="price">' + won(it.p) + '</p></article></li>';
  }
  function updateBar(rail) {
    var bar = rail.nextElementSibling;
    if (!bar || !bar.classList.contains('bar')) return;
    var i = $('i', bar), tot = rail.scrollWidth || 1;
    i.style.width = Math.min(100, rail.clientWidth / tot * 100) + '%';
    i.style.left = (rail.scrollLeft / tot * 100) + '%';
  }
  function render(id, list, rank, animate) {
    var ul = $('#' + id);
    ul.innerHTML = list.map(function (it, i) { return card(it, i, rank); }).join('');
    ul.scrollLeft = 0;
    updateBar(ul);
    if (animate && anim) g.from($$('.card', ul), { y: 40, opacity: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out', clearProps: 'transform,opacity' });
  }
  render('gProduct', best, true);
  render('gLove', love, false);
  render('gToday', today, false);

  $$('.tabs').forEach(function (tabs) {
    tabs.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      $$('button', tabs).forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
      var k = b.getAttribute('data-k'), id = tabs.getAttribute('data-target');
      if (id === 'gProduct') render(id, k === 'new' ? fresh : best, true, true);
      else render(id, k === 'all' ? today.slice(0, 8) : today.filter(function (x) { return x.t === k; }), false, true);
    });
  });
  // 상단 Today Best 첫 탭은 8개만 보여준다
  render('gToday', today.slice(0, 8), false);

  // 레일: 진행바 + 마우스 드래그
  $$('.rail').forEach(function (rail) {
    rail.addEventListener('scroll', function () { updateBar(rail); }, { passive: true });
    var sx = 0, sl = 0, down = false, moved = false;
    rail.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (Math.abs(dx) > 5) { moved = true; rail.classList.add('is-drag'); }
      if (moved) rail.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () { if (down) { down = false; setTimeout(function () { rail.classList.remove('is-drag'); }, 0); } });
    rail.addEventListener('click', function (e) { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
  });
  window.addEventListener('resize', function () { $$('.rail').forEach(updateBar); });
  window.addEventListener('load', function () { $$('.rail').forEach(updateBar); });

  /* ===== 3. 상품 클릭 → 하트 ===== */
  var wishCount = $('#wishCount'), wished = 0;
  function burst(x, y) {
    if (!anim) return;
    for (var i = 0; i < 10; i++) {
      var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      s.setAttribute('class', 'burst'); s.setAttribute('viewBox', '0 0 24 24');
      s.innerHTML = '<use href="#i-heart"/>';
      document.body.appendChild(s);
      var a = (Math.PI * 2 * i) / 10 + Math.random() * 0.5, d = 50 + Math.random() * 70;
      g.fromTo(s, { x: x, y: y, scale: 0.3, opacity: 1, rotation: 0 }, {
        x: x + Math.cos(a) * d, y: y + Math.sin(a) * d - 34, scale: 0.8 + Math.random() * 0.9,
        rotation: (Math.random() - 0.5) * 80, opacity: 0, duration: 0.9 + Math.random() * 0.5, ease: 'power2.out',
        onComplete: (function (el) { return function () { el.remove(); }; })(s)
      });
    }
  }
  document.addEventListener('click', function (e) {
    var c = e.target.closest ? e.target.closest('.card') : null;
    if (!c) return;
    var on = !c.classList.contains('is-wished');
    c.classList.toggle('is-wished', on);
    var h = $('.heart', c);
    h.setAttribute('aria-pressed', String(on));
    wished += on ? 1 : -1;
    wishCount.hidden = wished < 1;
    wishCount.textContent = wished;
    if (on) {
      var r = h.getBoundingClientRect();
      burst(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2);
      if (anim) {
        g.fromTo(h, { scale: 0.4 }, { scale: 1, duration: 0.9, ease: 'elastic.out(1,0.4)', clearProps: 'transform' });
        g.fromTo(wishCount, { scale: 1.9 }, { scale: 1, duration: 0.6, ease: 'back.out(3)', clearProps: 'transform' });
      }
    }
  });

  /* ===== 4. 헤더 · 모바일 메뉴 · 진행 막대 ===== */
  var header = $('#header'), burger = $('#burger'), gnb = $('#gnb'), progress = $('#progress');
  window.addEventListener('scroll', function () {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
    if (!anim) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
    }
  }, { passive: true });
  burger.addEventListener('click', function () {
    var open = !gnb.classList.contains('is-open');
    gnb.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('a', gnb).forEach(function (a) { a.addEventListener('click', function () { gnb.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }); });

  // 페이지 안 링크(#product 등) 부드럽게 이동 — CSS scroll-behavior:smooth 대신 사용
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a || a.classList.contains('skip')) return;
    var id = a.getAttribute('href'), t = id.length > 1 ? document.querySelector(id) : null;
    if (!t) return;
    e.preventDefault();
    if (lenis) { lenis.scrollTo(id === '#top' ? 0 : t, { duration: 1.2 }); return; }
    var y = id === '#top' ? 0 : t.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  });

  /* ===== 5. 슬라이더들 ===== */
  // 5-0 이미지 전환 공통 함수
  function swap(a, b, dir) {
    if (!anim) { a.classList.remove('is-on'); b.classList.add('is-on'); return; }
    a.style.zIndex = 1; b.style.zIndex = 2; b.classList.add('is-on');
    g.fromTo(b, { opacity: 0, xPercent: dir * 5, scale: 1.06 }, {
      opacity: 1, xPercent: 0, scale: 1, duration: 1, ease: 'power3.out',
      onComplete: function () { a.classList.remove('is-on'); a.style.zIndex = ''; g.set([a, b], { clearProps: 'opacity,transform,zIndex' }); }
    });
  }
  function textSwap(els, fn) {
    if (!anim) { fn(); return; }
    g.timeline()
      .to(els, { y: -16, opacity: 0, duration: 0.25, stagger: 0.03, ease: 'power2.in' })
      .add(fn)
      .fromTo(els, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: 'power3.out', clearProps: 'transform,opacity' });
  }
  function simple(imgsSel, prevSel, nextSel, apply) {
    var imgs = $$(imgsSel), cur = 0;
    function go(d) {
      var n = (cur + d + imgs.length) % imgs.length;
      swap(imgs[cur], imgs[n], d);
      cur = n; apply(n);
    }
    $(prevSel).addEventListener('click', function () { go(-1); });
    $(nextSel).addEventListener('click', function () { go(1); });
  }

  // 5-1 프로모 배너
  var promo = [
    { t: '공식온라인샵<br>결제 혜택', d: '골든듀 공식 온라인샵 단독<br>최대 12개월 무이자 할부 혜택' },
    { t: '기프트 패키지<br>선물 서비스', d: '리본 포장과 메시지 카드까지<br>정성껏 준비해 드려요' }
  ];
  simple('#promoBg img', '#pPrev', '#pNext', function (n) {
    textSwap([$('#pTitle'), $('#pDesc')], function () { $('#pTitle').innerHTML = promo[n].t; $('#pDesc').innerHTML = promo[n].d; });
  });

  // 5-2 베네핏
  var ben = [
    { t: '골든듀<br>온라인 멤버십', d: '공식 온라인샵 회원을 위해 준비한<br>특별한 혜택을 확인하세요' },
    { t: '구매 확정<br>리뷰 혜택', d: '구매 확정 후 리뷰를 남기면<br>포인트로 돌려드려요' }
  ];
  simple('#bImgs img', '#bPrev', '#bNext', function (n) {
    textSwap([$('#bTitle'), $('#bDesc')], function () { $('#bTitle').innerHTML = ben[n].t; $('#bDesc').innerHTML = ben[n].d; });
  });

  // 5-3 컬렉션 (폰타나마돈나 외)
  var col = [
    { img: 'fontana', alt: '폰타나마돈나 컬렉션', s: '시선이 머무는 화려함', t: '폰타나마돈나', d: '폰타나 마돈나 분수대의 우아한 황금빛 물결을<br>골든듀만의 금속 디테일로 섬세하게 표현한 디자인', h: '#황금빛물결 &nbsp; #플라워스터드' },
    { img: 'pearl', alt: '펄 가든 컬렉션', s: '청초하게 빛나는 순간', t: '펄 가든', d: '은은한 펄의 광택과 클로버 모티프가 어우러진<br>데일리 쥬얼리 컬렉션', h: '#펄 &nbsp; #클로버' },
    { img: 'honey', alt: '허니콤 컬렉션', s: '한 겹 더 화려하게', t: '허니콤', d: '벌집을 닮은 입체 패턴이 만드는 리드미컬한 빛<br>세 가지 골드 컬러로 만나보세요', h: '#허니콤 &nbsp; #3컬러' },
    { img: 'rose', alt: '로즈 듀 컬렉션', s: '따뜻하게 물드는 로즈', t: '로즈 듀', d: '로즈골드의 부드러운 온기를 담은<br>데일리 펜던트와 이어링', h: '#로즈골드 &nbsp; #데일리' }
  ];
  col.forEach(function (c) { new Image().src = 'img/collection/' + c.img + '.jpg'; });
  var foCur = 0, foImg = $('#foImg');
  function foGo(d) {
    foCur = (foCur + d + col.length) % col.length;
    var c = col[foCur];
    var setAll = function () {
      foImg.src = 'img/collection/' + c.img + '.jpg'; foImg.alt = c.alt;
      $('#foSub').textContent = c.s; $('#foTitle').textContent = c.t; $('#foDesc').innerHTML = c.d; $('#foHash').innerHTML = c.h;
    };
    var txt = [$('#foSub'), $('#foTitle'), $('#foDesc'), $('#foHash')];
    if (!anim) { setAll(); return; }
    g.timeline()
      .to(foImg, { xPercent: -d * 8, opacity: 0, duration: 0.35, ease: 'power2.in' }, 0)
      .to(txt, { y: -14, opacity: 0, duration: 0.25, stagger: 0.03 }, 0)
      .add(setAll)
      .fromTo(foImg, { xPercent: d * 8, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.8, ease: 'power3.out', clearProps: 'opacity' })
      .fromTo(txt, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: 'power3.out', clearProps: 'transform,opacity' }, '<0.1');
  }
  $('#foPrev').addEventListener('click', function () { foGo(-1); });
  $('#foNext').addEventListener('click', function () { foGo(1); });

  // 5-4 메인 비주얼
  var slides = [
    { tag: 'BEST GIFT', title: 'Love is Giving', desc: '전하는 순간, 비로소 완성되는 마음<br>골든듀의 베스트 기프트 아이템을 만나보세요.' },
    { tag: 'FOREVER LOVE', title: 'Shine Together', desc: '특별한 순간을 더 오래 빛나게<br>골든듀 다이아몬드 컬렉션을 소개합니다.' },
    { tag: 'NEW', title: 'Wrapped in Lavender', desc: '보랏빛 리본에 담은 설렘<br>새로 도착한 신상품을 만나보세요.' }
  ];
  var hImgs = $$('#heroImgs img'), hTag = $('#hTag'), hTitle = $('#hTitle'), hDesc = $('#hDesc'), hero = $('.hero');
  var dotsBox = $('#heroDots'), dots = [], cur = 0, timerTween, timerId, INT = 5.8, locked = false;
  hTitle.classList.add('split');
  function setTitle(t) {
    hTitle.setAttribute('aria-label', t);
    hTitle.innerHTML = t.split(' ').map(function (w) { return '<span class="w" aria-hidden="true"><span class="wi">' + w + '</span></span>'; }).join(' ');
  }
  setTitle(slides[0].title);
  slides.forEach(function (s, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.setAttribute('aria-label', (i + 1) + '번 배너'); b.innerHTML = '<i></i>';
    b.addEventListener('click', function () { show(i); });
    dotsBox.appendChild(b); dots.push(b);
  });
  function runTimer() {
    if (timerTween) timerTween.kill();
    clearInterval(timerId);
    dots.forEach(function (d, i) { d.classList.toggle('is-on', i === cur); });
    if (reduce) return;
    var fill = $('i', dots[cur]);
    if (g) timerTween = g.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: INT, ease: 'none', onComplete: function () { show(cur + 1); } });
    else timerId = setInterval(function () { show(cur + 1); }, INT * 1000);
  }
  function show(n) {
    n = (n + slides.length) % slides.length;
    if (n === cur || locked) { runTimer(); return; }
    var prev = cur, dir = n > prev ? 1 : -1, s = slides[n], a = hImgs[prev], b = hImgs[n];
    cur = n; locked = true;
    if (!anim) {
      a.classList.remove('is-on'); b.classList.add('is-on');
      hTag.textContent = s.tag; setTitle(s.title); hDesc.innerHTML = s.desc; locked = false; runTimer(); return;
    }
    a.style.zIndex = 1; b.style.zIndex = 2; b.classList.add('is-on');
    var tl = g.timeline({ onComplete: function () { locked = false; } });
    tl.fromTo(b, { clipPath: 'inset(0 0 0 100%)', scale: 1.15 }, { clipPath: 'inset(0 0 0 0%)', scale: 1, duration: 1.4, ease: 'power4.inOut',
      onComplete: function () { a.classList.remove('is-on'); a.style.zIndex = ''; g.set([a, b], { clearProps: 'clipPath,transform,zIndex' }); } }, 0)
      .to([hTag, hDesc, $('.hero-copy .more')], { y: -14, opacity: 0, duration: 0.3, stagger: 0.04, ease: 'power2.in' }, 0)
      .to($$('.wi', hTitle), { yPercent: -115, duration: 0.4, stagger: 0.03, ease: 'power2.in' }, 0)
      // 제목 교체 후, "새로 만든" 단어 요소를 그 자리에서 찾아 올려준다.
      // (예전 코드는 타임라인을 만들 때 옛 단어를 미리 잡아둬서, 새 제목이 아래에 숨은 채로 남았음)
      .add(function () {
        hTag.textContent = s.tag; setTitle(s.title); hDesc.innerHTML = s.desc;
        g.fromTo($$('.wi', hTitle), { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.07, ease: 'power4.out', clearProps: 'transform', delay: 0.05 });
      }, 0.5)
      .fromTo([hTag, hDesc, $('.hero-copy .more')], { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', clearProps: 'transform,opacity' }, 0.7);
    runTimer();
  }
  $('.hero .next').addEventListener('click', function () { show(cur + 1); });
  $('.hero .prev').addEventListener('click', function () { show(cur - 1); });
  hero.addEventListener('mouseenter', function () { if (timerTween) timerTween.pause(); });
  hero.addEventListener('mouseleave', function () { if (timerTween) timerTween.resume(); });

  // 5-5 Real Review: 처음엔 블러 → 마우스가 가까워질수록 선명 (터치 기기: 화면 중앙에 가까워질수록 선명)
  var rg = $('#rvGrid');
  if (rg) {
    var rvs = $$('li', rg), ticking = false, mx = -9999, my = -9999;
    rg.classList.add('is-blur');
    var smooth = function (p) { p = Math.max(0, Math.min(1, p)); return p * p * (3 - 2 * p); };
    var paint = function () {
      ticking = false;
      var vh = window.innerHeight;
      rvs.forEach(function (li) {
        var r = li.getBoundingClientRect(), p = 0;
        if (r.bottom > 0 && r.top < vh) {
          if (canHover) {
            var dx = Math.max(r.left - mx, 0, mx - r.right), dy = Math.max(r.top - my, 0, my - r.bottom);
            p = smooth(1 - Math.sqrt(dx * dx + dy * dy) / Math.max(200, r.width * 0.85));
          } else {
            p = smooth(1 - Math.abs(r.top + r.height / 2 - vh * 0.5) / (vh * 0.38));
          }
        }
        li.style.setProperty('--p', p.toFixed(3));
      });
    };
    var ask = function () { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };
    if (canHover) {
      document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; ask(); });
      document.addEventListener('mouseleave', function () { mx = my = -9999; ask(); });
    }
    window.addEventListener('scroll', ask, { passive: true });
    window.addEventListener('resize', ask);
    rvs.forEach(function (li) {
      li.tabIndex = 0;
      li.addEventListener('focus', function () { li.classList.add('is-pin'); });
      li.addEventListener('blur', function () { li.classList.remove('is-pin'); });
      li.addEventListener('click', function () { li.classList.toggle('is-pin'); });
    });
    paint();
  }

  if (!anim) { runTimer(); return; }   // GSAP 없음 → 기본 기능만

  /* ===== 6. GSAP 연출 ===== */
  // 6-0-a 부드러운 휠 스크롤 (Lenis) : 마우스 휠의 '뚝뚝' 끊기는 스크롤을 매끄럽게 만들고,
  //       GSAP 과 같은 박자(ticker)로 움직여서 고정(pin) 섹션이 떨리거나 튀지 않게 한다.
  //       (Lenis 가 로드되지 않으면 그냥 기본 스크롤로 동작)
  if (window.Lenis && ST) {
    lenis = new window.Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis.on('scroll', ST.update);
    g.ticker.add(function (time) { lenis.raf(time * 1000); });
    g.ticker.lagSmoothing(0);
    lenis.stop();   // 로딩 커튼 동안은 스크롤 잠금
  }

  // 6-0 로딩 커튼 → 히어로 인트로
  var loader = document.createElement('div');
  loader.className = 'loader';
  loader.innerHTML = '<img src="img/common/logo.png" alt="GOLDEN DEW"><i></i>';
  document.body.appendChild(loader);
  document.documentElement.style.overflow = 'hidden';
  var intro = g.timeline({ onComplete: function () { loader.remove(); document.documentElement.style.overflow = ''; if (lenis) lenis.start(); runTimer(); if (ST) ST.refresh(); } });
  intro.from('.loader img', { opacity: 0, y: 14, duration: 0.8, ease: 'power3.out' })
    .from('.loader i', { scaleX: 0, duration: 1, ease: 'power2.inOut' }, 0.2)
    .to('.loader', { yPercent: -100, duration: 1, ease: 'power4.inOut', delay: 0.2 })
    .from(header, { yPercent: -100, duration: 0.8, ease: 'power3.out', clearProps: 'transform' }, '-=0.5')
    .from(hImgs[0], { scale: 1.25, duration: 2, ease: 'power3.out', clearProps: 'transform' }, '<')
    .from('#hTag', { y: 20, opacity: 0, duration: 0.7, clearProps: 'transform,opacity' }, '-=1.5')
    .from($$('.wi', hTitle), { yPercent: 115, duration: 1, stagger: 0.08, ease: 'power4.out', clearProps: 'transform' }, '-=1.3')
    .from(['#hDesc', '.hero-copy .more', '#heroDots', '.notice'], { y: 24, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', clearProps: 'transform,opacity' }, '-=0.8');
  if (timerTween) timerTween.kill();
  clearInterval(timerId);

  // 6-1 마우스: 히어로 패럴랙스 · 반짝임 · 카드 틸트 · 자석 버튼
  if (canHover) {
    var qx = g.quickTo(hImgs[0].parentNode, 'x', { duration: 1, ease: 'power3.out' });
    var qy = g.quickTo(hImgs[0].parentNode, 'y', { duration: 1, ease: 'power3.out' });
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      qx(((e.clientX - r.left) / r.width - 0.5) * -22);
      qy(((e.clientY - r.top) / r.height - 0.5) * -14);
    });
    hero.addEventListener('mouseleave', function () { qx(0); qy(0); });

    var lastSp = 0;
    document.addEventListener('mousemove', function (e) {
      var now = performance.now();
      if (now - lastSp < 55 || e.target.closest('.rail.is-drag')) return;
      lastSp = now;
      var s = document.createElement('i');
      s.className = 'sparkle';
      document.body.appendChild(s);
      g.fromTo(s, { x: e.clientX + (Math.random() - 0.5) * 14, y: e.clientY + (Math.random() - 0.5) * 14, scale: 0.4 + Math.random() * 0.9, opacity: 1, rotation: 45 }, {
        y: '+=' + (24 + Math.random() * 30), x: '+=' + ((Math.random() - 0.5) * 40), rotation: 225, scale: 0, opacity: 0, duration: 0.9, ease: 'power2.out',
        onComplete: function () { s.remove(); }
      });
    });

    var tiltEl = null;
    document.addEventListener('mousemove', function (e) {
      var t = e.target.closest ? e.target.closest('.thumb') : null;
      if (tiltEl && tiltEl !== t) { g.to(tiltEl, { rotationX: 0, rotationY: 0, duration: 0.7, ease: 'power3.out' }); tiltEl = null; }
      if (!t) return;
      tiltEl = t;
      var r = t.getBoundingClientRect();
      g.to(t, { rotationY: ((e.clientX - r.left) / r.width - 0.5) * 12, rotationX: -((e.clientY - r.top) / r.height - 0.5) * 12, transformPerspective: 800, duration: 0.5, overwrite: 'auto' });
    });

    $$('.more, .arw, .fo-ctrl button, .promo-ctrl button, .bn-ctrl button, .pill').forEach(function (el) {
      el.addEventListener('mousemove', function (ev) {
        var r = el.getBoundingClientRect();
        g.to(el, { x: (ev.clientX - (r.left + r.width / 2)) * 0.28, y: (ev.clientY - (r.top + r.height / 2)) * 0.4, duration: 0.4, overwrite: 'auto' });
      });
      el.addEventListener('mouseleave', function () { g.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,0.45)', overwrite: 'auto' }); });
    });
  }

  if (!ST) return;

  // 6-2 스크롤 진행 막대
  g.to(progress, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

  // 6-3 헤더: 내리면 숨고, 올리면 나타남
  var hidden = false;
  ST.create({ start: 0, end: 'max', onUpdate: function (self) {
    var hide = self.direction === 1 && self.scroll() > 500 && !gnb.classList.contains('is-open');
    if (hide === hidden) return;
    hidden = hide;
    g.to(header, { yPercent: hide ? -110 : 0, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
  } });

  // 6-4 제목: 단어 마스크 reveal
  $$('.split').forEach(function (h) {
    if (h === hTitle) return;
    var txt = h.textContent.trim();
    h.setAttribute('aria-label', txt);
    h.innerHTML = txt.split(' ').map(function (w) { return '<span class="w" aria-hidden="true"><span class="wi">' + w + '</span></span>'; }).join(' ');
    g.from($$('.wi', h), { yPercent: 115, duration: 1, stagger: 0.08, ease: 'power4.out', clearProps: 'transform', scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
  });
  $$('.rv').forEach(function (el) {
    g.from(el, { y: 36, opacity: 0, duration: 0.9, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  // 6-5 상품 카드 · 카테고리 · 후기 등장
  ['#gProduct', '#gLove', '#gToday'].forEach(function (id) {
    g.from($$('.card', $(id)).slice(0, 8), { y: 56, opacity: 0, duration: 0.85, stagger: 0.09, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: id, start: 'top 90%', once: true } });
  });
  $$('.cats li').forEach(function (li, i) {
    var box = $('.cat-img', li), img = $('img', li);
    g.from(box, { clipPath: 'inset(100% 0 0 0)', duration: 1.2, delay: i * 0.1, ease: 'power4.inOut', clearProps: 'clipPath', scrollTrigger: { trigger: '.cats', start: 'top 85%', once: true } });
    g.from(img, { scale: 1.4, duration: 1.6, delay: i * 0.1, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: '.cats', start: 'top 85%', once: true } });
    g.from($('b', li), { y: 14, opacity: 0, duration: 0.7, delay: 0.5 + i * 0.1, clearProps: 'transform,opacity', scrollTrigger: { trigger: '.cats', start: 'top 85%', once: true } });
  });
  $$('.rv-grid li').forEach(function (li, i) {
    g.from(li, { y: 60, opacity: 0, rotate: i % 2 ? 1.5 : -1.5, duration: 1, delay: i * 0.1, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.rv-grid', start: 'top 85%', once: true } });
  });

  // 6-6 컬렉션 · 혜택 : 등장 + 패럴랙스
  g.from('.fo-img', { clipPath: 'inset(0 100% 0 0)', duration: 1.4, ease: 'power4.inOut', clearProps: 'clipPath', scrollTrigger: { trigger: '.fontana', start: 'top 70%', once: true } });
  g.from('.fo-copy > *', { y: 30, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.fontana', start: 'top 65%', once: true } });
  g.fromTo('#foImg', { scale: 1.12, yPercent: -3 }, { scale: 1.02, yPercent: 3, ease: 'none', scrollTrigger: { trigger: '.fontana', start: 'top bottom', end: 'bottom top', scrub: true } });
  g.from('.bn-card', { x: -60, opacity: 0, duration: 1, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.bn-in', start: 'top 80%', once: true } });
  g.from('.bn-img', { x: 60, opacity: 0, duration: 1, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.bn-in', start: 'top 80%', once: true } });
  g.from('.promo-copy > *', { x: -30, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.promo', start: 'top 85%', once: true } });
  g.from('.service li', { y: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.service', start: 'top 90%', once: true } });

  // 6-7 마키: 기본 속도 + 스크롤 속도에 반응
  //  (예전 코드는 스크롤할 때마다 트윈이 계속 쌓여서 스크롤이 버벅이는 원인이 됐음 → 항상 1개만 유지)
  var mt = g.to('.marquee-track', { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
  ST.create({ start: 0, end: 'max', onUpdate: function (self) {
    var dir = self.direction === 1 ? 1 : -1;
    var speed = Math.min(6, 1 + Math.abs(self.getVelocity()) / 260);
    g.to(mt, { timeScale: dir * speed, duration: 0.3, overwrite: true,
      onComplete: function () { g.to(mt, { timeScale: dir, duration: 1, overwrite: true }); } });
  } });

  // 6-8 룩북: 데스크톱은 세로 스크롤 → 가로 이동 (고정)
  var mm = g.matchMedia();
  mm.add('(min-width: 821px)', function () {
    var track = $('#lookTrack'), look = $('#look'), no = $('#lookNo');
    var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
    var lastNo = '';
    // scrub: 1(1초 늦게 따라옴) → 고정이 풀릴 때 사진이 아직 움직이는 중이라 '멈췄다/튄다' 느낌이 났음.
    // Lenis 가 이미 부드럽게 해 주므로 스크롤에 바로 붙게(true) 하고, anticipatePin(미리 고정 → 툭 튐)도 끔.
    var tween = g.to(track, { x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: { trigger: look, start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: lenis ? true : 0.4, anticipatePin: lenis ? 0 : 1, invalidateOnRefresh: true,
        onUpdate: function (self) {
          var t = ('0' + Math.min(6, Math.floor(self.progress * 6) + 1)).slice(-2) + ' / 06';
          if (t !== lastNo) { lastNo = t; no.textContent = t; }
        } } });
    $$('img', track).forEach(function (img) {
      g.fromTo(img, { xPercent: 9, scale: 1.25 }, { xPercent: -9, scale: 1.25, ease: 'none',
        scrollTrigger: { trigger: img.parentNode, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
    });
    g.from('.look-head > *', { y: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: look, start: 'top 70%', once: true } });
  });

  window.addEventListener('load', function () { ST.refresh(); });
  // 웹폰트가 늦게 적용되면 섹션 높이가 바뀌어 고정 위치가 어긋남 → 폰트 로드 후 다시 계산
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
})();

