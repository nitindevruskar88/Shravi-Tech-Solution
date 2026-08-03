// Loader
window.addEventListener('load', function () {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.3s';
        setTimeout(() => { loader.style.display = 'none'; }, 300);
    }
});

// Contact form submit झाल्यावर (Web3Forms च्या redirect मुळे) परत आपल्याच site वर आलो
// तर generic page ऐवजी इथेच सुंदर "Thank You" संदेश दाखवतो
(function showThankYouIfSubmitted() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('submitted') === 'true') {
        const form = document.getElementById('contactForm');
        const thankYou = document.getElementById('thankYouMessage');
        if (form) form.style.display = 'none';
        if (thankYou) thankYou.style.display = 'block';
        // URL स्वच्छ करतो (पुन्हा refresh केलं तर परत तोच संदेश दिसू नये)
        window.history.replaceState({}, document.title, window.location.pathname + '#contact');
    }
})();

// Scroll to top button
const topBtn = document.getElementById('topBtn');
window.addEventListener('scroll', () => {
    if (topBtn) topBtn.style.display = window.scrollY > 400 ? 'block' : 'none';
});
if (topBtn) topBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// Terminal typing animation (hero signature)
(function typeTerminal() {
    const el = document.getElementById('typed-line');
    if (!el) return;

    const lines = [
        { text: '$ cat shravitech --about', cls: 'prompt' },
        { text: '  Software Development  → Custom ERP, CRM, billing', cls: 'ok' },
        { text: '  Website Development   → Fast, responsive, converts', cls: 'ok' },
        { text: '  Automation Scripts    → Python, scheduled workflows', cls: 'ok' },
        { text: '  Database Engineering  → PostgreSQL, query tuning', cls: 'ok' },
        { text: '  Power BI Dashboards   → Live business reporting', cls: 'ok' },
        { text: '$ status --team', cls: 'prompt' },
        { text: '  Ready to build. Let\u2019s talk \u2192', cls: 'ok' },
    ];

    const container = el.parentElement;
    let lineIndex = 0, charIndex = 0;

    function typeNext() {
        if (lineIndex >= lines.length) {
            setTimeout(() => {
                container.querySelectorAll('.type-line').forEach(l => l.remove());
                el.textContent = '';
                lineIndex = 0; charIndex = 0;
                typeNext();
            }, 2200);
            return;
        }
        const current = lines[lineIndex];
        if (charIndex === 0) {
            el.className = current.cls;
        }
        if (charIndex < current.text.length) {
            el.textContent += current.text.charAt(charIndex);
            charIndex++;
            setTimeout(typeNext, 22);
        } else {
            el.classList.add('type-line');
            const finished = el;
            finished.removeAttribute('id');
            const next = document.createElement('span');
            next.id = 'typed-line';
            next.style.display = 'block';
            container.appendChild(next);
            lineIndex++; charIndex = 0;
            setTimeout(typeNext, 260);
        }
    }
    typeNext();
})();

// Animated counters
(function initCounters() {
    const counters = document.querySelectorAll('[data-target]');
    if (!counters.length) return;
    const animate = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const start = performance.now();
        const duration = 1300;
        function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(eased * target) + suffix;
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target + suffix;
        }
        requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); }
        });
    }, { threshold: 0.6 });
    counters.forEach(c => obs.observe(c));
})();

// Scroll reveal for sections, service rows, cards, etc.
(function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal, .reveal-stagger');
    if (!targets.length) return;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in-view');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });
    targets.forEach(t => obs.observe(t));
})();

// =======================================
// SECTION BACKGROUND ANIMATIONS
// प्रत्येक section ला वेगळं animated background (सगळं custom canvas code, कुठलीही copyrighted image नाही)
// =======================================
(function initSectionBackgrounds() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    function setupCanvas(id) {
        const canvas = document.getElementById(id);
        if (!canvas) return null;
        const ctx = canvas.getContext('2d');
        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        window.addEventListener('resize', resize);
        resize();
        return { canvas, ctx };
    }

    // एकच "Wave" animation - सगळ्या sections साठी वापरतो
    function wavesBg(canvasId) {
        const setup = setupCanvas(canvasId);
        if (!setup) return;
        const { canvas, ctx } = setup;
        let t = 0;
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const waveConfigs = [
                { amp: 22, freq: 0.012, speed: 0.012, y: canvas.height * 0.3, color: 'rgba(0,208,132,0.28)' },
                { amp: 28, freq: 0.008, speed: 0.01, y: canvas.height * 0.6, color: 'rgba(10,24,48,0.16)' },
                { amp: 18, freq: 0.016, speed: 0.015, y: canvas.height * 0.85, color: 'rgba(0,208,132,0.22)' },
            ];
            waveConfigs.forEach(w => {
                ctx.beginPath();
                for (let x = 0; x <= canvas.width; x += 4) {
                    const y = w.y + Math.sin(x * w.freq + t * w.speed) * w.amp;
                    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.strokeStyle = w.color;
                ctx.lineWidth = 2.5;
                ctx.stroke();
            });
            t++;
            requestAnimationFrame(draw);
        }
        requestAnimationFrame(draw);
    }

    wavesBg('canvas-pillars');
    wavesBg('canvas-about');
    wavesBg('canvas-services');
    wavesBg('canvas-why');
    wavesBg('canvas-testimonials');
})();
