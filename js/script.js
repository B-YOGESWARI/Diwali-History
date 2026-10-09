/* =========================================================
   DIWALI — A Journey Through Light
   Interactive cinematic script
========================================================= */

(function () {
    'use strict';

    const siteHeader = document.getElementById('siteHeader');
    const mainNav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const surpriseButton = document.getElementById('surpriseButton');
    const surpriseDecorations = document.getElementById('surpriseDecorations');
    const cinematicVideoWrapper = document.getElementById('cinematicVideoWrapper');
    const openingCinematicVideo = document.getElementById('openingCinematicVideo');

    if (openingCinematicVideo) {
        openingCinematicVideo.playbackRate = 0.75;
        openingCinematicVideo.defaultPlaybackRate = 0.75;
    }

    const globalBgVideo = document.getElementById('globalBackgroundVideo');
    const homeVideo = document.getElementById('homeBackgroundVideo') || globalBgVideo;

    function handleNavigationScroll() {
        if (!siteHeader) return;
        siteHeader.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', handleNavigationScroll, { passive: true });
    handleNavigationScroll();

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function () {
            const isOpen = mainNav.classList.toggle('open');
            navToggle.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
            navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
        });

        mainNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mainNav.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Open navigation');
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (event) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;
            event.preventDefault();
            const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
            const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        });
    });

    function playGlobalBg() {
        const vid = globalBgVideo || homeVideo;
        if (!vid) return;
        vid.muted = true;
        const p = vid.play();
        if (p && p.catch) p.catch(function () {});
    }
    playGlobalBg();
    window.addEventListener('load', playGlobalBg, { once: true });
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) playGlobalBg();
    });

    const revealElements = document.querySelectorAll('.cinematic-reveal');
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
        );
        revealElements.forEach(function (el) { revealObserver.observe(el); });
    } else {
        revealElements.forEach(function (el) { el.classList.add('visible'); });
    }


    /* ---------- Enhanced Diwali confetti (papers, hearts, flowers, sparkles) ---------- */
    function createExtraConfetti() {
        if (!surpriseDecorations) return;
        const papers = surpriseDecorations.querySelectorAll('.paper');
        papers.forEach(function (paper, index) {
            const drift = (Math.random() * 160 - 80).toFixed(0) + 'px';
            const spin = (480 + Math.random() * 600).toFixed(0) + 'deg';
            paper.style.left = (Math.random() * 96) + '%';
            paper.style.setProperty('--i', index + 1);
            paper.style.setProperty('--drift', drift);
            paper.style.setProperty('--spin', spin);
            paper.style.animationDelay = (Math.random() * 0.55) + 's';
            paper.style.animationDuration = (2.6 + Math.random() * 2.2) + 's';
            // tiny size variety
            const w = 2.5 + Math.random() * 3.5;
            const h = 4 + Math.random() * 5;
            paper.style.width = w + 'px';
            paper.style.height = h + 'px';
        });
    }


    function createFloatingCelebration() {
        const emojis = ['✨', '🪔', '🌸', '🌼', '🎆', '🎇', '💫', '🪷', '⭐', '🌺'];
        const container = document.createElement('div');
        container.className = 'temporary-diwali-celebration';
        container.setAttribute('aria-hidden', 'true');

        for (let i = 0; i < 35; i++) {
            const el = document.createElement('span');
            el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            const size = 18 + Math.random() * 26;
            el.style.left = (Math.random() * 100) + '%';
            el.style.fontSize = size + 'px';
            el.style.animationDelay = (Math.random() * 1.2) + 's';
            el.style.animationDuration = (2.5 + Math.random() * 2.5) + 's';
            el.style.animationName = 'diwaliFloat';
            el.style.animationTimingFunction = 'ease-out';
            el.style.animationFillMode = 'forwards';
            container.appendChild(el);
        }

        document.body.appendChild(container);
        setTimeout(function () { container.remove(); }, 5500);
    }

    /* CRITICAL: remove hidden attribute or video stays display:none */
    function showVideoWrapper() {
        if (!cinematicVideoWrapper) {
            console.warn('cinematicVideoWrapper not found');
            return;
        }
        cinematicVideoWrapper.removeAttribute('hidden');
        cinematicVideoWrapper.hidden = false;
        cinematicVideoWrapper.classList.add('video-visible');
        cinematicVideoWrapper.style.display = 'block';
        cinematicVideoWrapper.style.opacity = '1';
        cinematicVideoWrapper.style.visibility = 'visible';
        cinematicVideoWrapper.style.transform = 'translateY(0)';
    }

    function startVideo() {
        if (!openingCinematicVideo) {
            console.warn('openingCinematicVideo not found.');
            return;
        }

        openingCinematicVideo.playbackRate = 0.75;
        openingCinematicVideo.defaultPlaybackRate = 0.75;

        showVideoWrapper();

        try {
            openingCinematicVideo.currentTime = 0;
        } catch (e) {
            console.warn('Unable to reset video:', e);
        }

        const playPromise = openingCinematicVideo.play();
        if (playPromise !== undefined) {
            playPromise
                .then(function () {
                    if (cinematicVideoWrapper) {
                        cinematicVideoWrapper.classList.add('is-playing');
                    }
                })
                .catch(function (err) {
                    console.warn('Autoplay blocked — use controls or New Tab:', err);
                    showVideoWrapper();
                });
        }
    }

    let surpriseAlreadyPlayed = false;

    function triggerDiwaliSurprise() {
        if (!surpriseButton) return;

        if (surpriseAlreadyPlayed) {
            startVideo();
            return;
        }
        surpriseAlreadyPlayed = true;

        surpriseButton.classList.add('opened', 'surprise-opened');

        if (surpriseDecorations) {
            surpriseDecorations.classList.add('active');
            createExtraConfetti();
            launchDiwaliConfettiBurst();
        }

        createFloatingCelebration();
        showVideoWrapper();

        setTimeout(function () {
            if (cinematicVideoWrapper) {
                cinematicVideoWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 450);

        setTimeout(startVideo, 700);

        setTimeout(function () {
            if (surpriseDecorations) {
                surpriseDecorations.classList.remove('active');
            }
        }, 4300);
    }

    if (surpriseButton) {
        surpriseButton.addEventListener('click', triggerDiwaliSurprise);
        surpriseButton.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                triggerDiwaliSurprise();
            }
        });
    } else {
        console.warn('surpriseButton not found');
    }

    if (openingCinematicVideo) {
        openingCinematicVideo.addEventListener('play', function () {
            if (cinematicVideoWrapper) {
                cinematicVideoWrapper.classList.add('is-playing');
            }
        });

        openingCinematicVideo.addEventListener('ended', function () {
            if (cinematicVideoWrapper) {
                cinematicVideoWrapper.classList.add('video-finished');
            }
            setTimeout(function () {
                const journey = document.getElementById('journey');
                if (journey) {
                    journey.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 1200);
        });

        openingCinematicVideo.addEventListener('pause', function () {
            if (
                openingCinematicVideo.currentTime < openingCinematicVideo.duration &&
                cinematicVideoWrapper
            ) {
                cinematicVideoWrapper.classList.remove('is-playing');
            }
        });

        openingCinematicVideo.addEventListener('error', function () {
            console.error(
                'Diwali cinematic video could not be loaded. Expected path:',
                'Assets/videos/scenes/diwali-rama-story-40sec.mp4'
            );
            showVideoWrapper();
        });
    }

    const heroParticles = document.querySelectorAll('.hero-particles span');
    if (
        heroParticles.length > 0 &&
        window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    ) {
        window.addEventListener('mousemove', function (event) {
            const x = (event.clientX / window.innerWidth - 0.5) * 12;
            const y = (event.clientY / window.innerHeight - 0.5) * 12;
            heroParticles.forEach(function (particle, index) {
                const factor = (index + 1) * 0.15;
                particle.style.transform = 'translate(' + (x * factor) + 'px, ' + (y * factor) + 'px)';
            });
        }, { passive: true });
    }

    const todaySection = document.getElementById('today');
    if (todaySection) {
        todaySection.querySelectorAll('.today-particles span, .chapter-visual-particles span').forEach(function (particle, index) {
            particle.style.animationDelay = (index * 0.35) + 's';
        });
    }

    window.addEventListener('load', function () {
        document.body.classList.add('page-loaded');
        if (openingCinematicVideo) {
            openingCinematicVideo.pause();
            try {
                openingCinematicVideo.currentTime = 0;
            } catch (e) {}
        }
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.cinematic-reveal').forEach(function (el) {
            el.classList.add('visible');
        });
    }

    const chapterRows = document.querySelectorAll('.chapter-row');

    function closeAllChapters(except) {
        chapterRows.forEach(function (row) {
            if (except && row === except) return;
            row.classList.remove('is-open');
            const btn = row.querySelector('.chapter-trigger');
            const panel = row.querySelector('.chapter-panel');
            if (btn) btn.setAttribute('aria-expanded', 'false');
            if (panel) {
                panel.hidden = true;
            }
        });
    }

    function openChapter(row) {
        closeAllChapters(row);
        row.classList.add('is-open');
        const btn = row.querySelector('.chapter-trigger');
        const panel = row.querySelector('.chapter-panel');
        if (btn) btn.setAttribute('aria-expanded', 'true');
        if (panel) {
            panel.hidden = false;
        }
        setTimeout(function () {
            const headerH = siteHeader ? siteHeader.offsetHeight : 0;
            const top = row.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }, 80);
    }

    chapterRows.forEach(function (row) {
        const btn = row.querySelector('.chapter-trigger');
        if (!btn) return;

        btn.addEventListener('click', function () {
            const isOpen = row.classList.contains('is-open');
            if (isOpen) {
                closeAllChapters(null);
            } else {
                openChapter(row);
            }
        });
    });

    

    /* ---------- Festive colorful cursor trail ---------- */
    (function initDiwaliCursor() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (window.matchMedia('(max-width: 768px)').matches) return;
        if (!window.matchMedia('(pointer: fine)').matches) return;

        var colors = [
            '#FFD76A', '#FF9F1C', '#FF6B35', '#E8B84A',
            '#FF4D6D', '#C77DFF', '#4CC9F0', '#80FFDB',
            '#FFB703', '#FB8500'
        ];
        var dots = [];
        var count = 14;
        var mouseX = -100;
        var mouseY = -100;

        for (var i = 0; i < count; i++) {
            var d = document.createElement('div');
            d.className = 'diwali-cursor-dot';
            d.style.background = colors[i % colors.length];
            d.style.boxShadow = '0 0 10px ' + colors[i % colors.length];
            d.style.width = (10 - i * 0.45) + 'px';
            d.style.height = (10 - i * 0.45) + 'px';
            document.body.appendChild(d);
            dots.push({ el: d, x: -100, y: -100 });
        }

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        document.addEventListener('mouseleave', function () {
            mouseX = -100;
            mouseY = -100;
        });

        function animateCursor() {
            var x = mouseX;
            var y = mouseY;
            dots.forEach(function (dot, i) {
                var nextX = i === 0 ? x : dots[i - 1].x;
                var nextY = i === 0 ? y : dots[i - 1].y;
                dot.x += (nextX - dot.x) * (0.28 - i * 0.012);
                dot.y += (nextY - dot.y) * (0.28 - i * 0.012);
                dot.el.style.left = dot.x + 'px';
                dot.el.style.top = dot.y + 'px';
                dot.el.style.opacity = mouseX < 0 ? '0' : String(0.85 - i * 0.05);
            });
            requestAnimationFrame(animateCursor);
        }
        requestAnimationFrame(animateCursor);
    })();

    


    /* =========================================================
       CONFETTI — Home ambient | Surprise burst | Final photo only
       NO confetti on Journey / Traditions / Today / nav clicks
    ========================================================= */

    var confettiReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var confettiMobile = window.matchMedia('(max-width: 768px)').matches;

    function makeTinyPiece(colors) {
        var piece = document.createElement('div');
        piece.className = 'diwali-confetti-piece is-paper';
        var color = colors[Math.floor(Math.random() * colors.length)];
        var roll = Math.random();

        if (roll < 0.08) {
            piece.className = 'diwali-confetti-piece is-heart-emoji';
            piece.textContent = Math.random() > 0.5 ? '♥' : '•';
            piece.style.fontSize = (4 + Math.random() * 3) + 'px';
            piece.style.color = color;
            piece.style.background = 'none';
        } else if (roll < 0.14) {
            piece.className = 'diwali-confetti-piece is-sparkle-emoji';
            piece.textContent = '✦';
            piece.style.fontSize = (3 + Math.random() * 3) + 'px';
            piece.style.color = color;
            piece.style.background = 'none';
        } else if (roll < 0.40) {
            var d = 2 + Math.random() * 2.5;
            piece.style.width = d + 'px';
            piece.style.height = d + 'px';
            piece.style.borderRadius = '50%';
            piece.style.background = color;
        } else {
            var w = 2 + Math.random() * 3;
            var h = 3 + Math.random() * 4.5;
            piece.style.width = w + 'px';
            piece.style.height = h + 'px';
            piece.style.borderRadius = '1px';
            piece.style.background = color;
        }
        if (color === '#ffcc00' || color === '#d9a441' || color === '#ffe566') {
            piece.style.boxShadow = '0 0 3px rgba(255, 200, 80, 0.4)';
        }
        return piece;
    }

    var PAPER_COLORS = [
        '#ff4d6d', '#ff2d55', '#ff8fab', '#ff9500', '#ffd60a',
        '#ffe566', '#ffcc00', '#d9a441', '#30d158', '#80ffdb',
        '#0a84ff', '#4cc9f0', '#af52de', '#c77dff'
    ];

    /* --- HOME: continuous ambient layer (only while home in view) --- */
    function initHomeConfetti() {
        if (confettiReduced) return;
        var home = document.getElementById('home');
        if (!home) return;

        var layer = document.createElement('div');
        layer.className = 'home-confetti-layer';
        layer.setAttribute('aria-hidden', 'true');
        home.appendChild(layer);

        var count = confettiMobile ? 90 : 160;
        for (var i = 0; i < count; i++) {
            var piece = makeTinyPiece(PAPER_COLORS);
            piece.classList.add('home-float-piece');
            piece.style.left = (Math.random() * 100) + '%';
            piece.style.top = (Math.random() * 100) + '%';
            piece.style.animationDelay = (Math.random() * 8) + 's';
            piece.style.animationDuration = (6 + Math.random() * 10) + 's';
            piece.style.opacity = String(0.35 + Math.random() * 0.5);
            layer.appendChild(piece);
        }

        // Pause when home not visible (performance)
        if ('IntersectionObserver' in window) {
            var obs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    layer.style.display = entry.isIntersecting ? '' : 'none';
                });
            }, { threshold: 0.05 });
            obs.observe(home);
        }
    }

    /* --- SURPRISE: large burst on button only --- */
    function burstDiwaliConfettiAt(clientX, clientY, options) {
        options = options || {};
        if (confettiReduced) return;

        var count = options.count || (confettiMobile ? 70 : 110);
        if (typeof clientX !== 'number') clientX = window.innerWidth / 2;
        if (typeof clientY !== 'number') clientY = window.innerHeight * 0.3;

        var layer = document.createElement('div');
        layer.className = 'diwali-confetti-layer';
        layer.setAttribute('aria-hidden', 'true');
        document.body.appendChild(layer);

        for (var i = 0; i < count; i++) {
            var piece = makeTinyPiece(PAPER_COLORS);
            piece.style.position = 'fixed';
            piece.style.left = clientX + 'px';
            piece.style.top = clientY + 'px';
            piece.style.margin = '0';

            var upward = !!options.upward;
            // Prefer upper hemisphere when upward bloom is requested
            var angle;
            if (upward) {
                // -PI to 0 roughly = upward half, with spread
                angle = -Math.PI + (Math.PI * (i / count)) + (Math.random() * 0.4 - 0.2);
            } else {
                angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            }
            var dist = (upward ? 50 : 30) + Math.random() * (upward ? 180 : 140);
            var bx = Math.cos(angle) * dist * (upward ? 1.15 : 1);
            // Negative Y is up in CSS transforms
            var by = upward
                ? (-Math.abs(Math.sin(angle)) * dist - 40 - Math.random() * 120)
                : (Math.sin(angle) * dist * 0.45 - 20 - Math.random() * 50);
            piece.style.setProperty('--burst-x', bx.toFixed(0) + 'px');
            piece.style.setProperty('--burst-y', by.toFixed(0) + 'px');
            piece.style.setProperty('--drift-x', (bx * 0.55 + Math.random() * 80 - 40).toFixed(0) + 'px');
            piece.style.setProperty('--spin', (200 + Math.random() * 600).toFixed(0) + 'deg');
            piece.style.animationName = upward ? 'diwaliConfettiBloom' : 'diwaliConfettiFall';
            piece.style.animationTimingFunction = 'cubic-bezier(0.22, 0.61, 0.36, 1)';
            piece.style.animationFillMode = 'forwards';
            piece.style.animationDelay = (Math.random() * 0.2) + 's';
            piece.style.animationDuration = (upward ? 3.2 : 2.8) + Math.random() * 1.8 + 's';
            layer.appendChild(piece);
        }

        setTimeout(function () {
            if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
        }, 5200);
    }

    function launchDiwaliConfettiBurst() {
        if (confettiReduced) return;

        var layer = document.createElement('div');
        layer.className = 'diwali-confetti-layer';
        layer.setAttribute('aria-hidden', 'true');
        document.body.appendChild(layer);

        // At least 2000 on desktop; still dense on mobile
        var total = confettiMobile ? 900 : 2000;
        var accentEmojis = ['✦', '✧', '★', '🌸', '🌺', '🌼', '💛', '✨'];

        for (var i = 0; i < total; i++) {
            var piece = document.createElement('div');
            var roll = Math.random();
            var color = PAPER_COLORS[Math.floor(Math.random() * PAPER_COLORS.length)];

            if (roll < 0.07) {
                // sparse accents like stars / tiny flowers
                piece.className = 'diwali-confetti-piece is-sparkle-emoji';
                piece.textContent = accentEmojis[Math.floor(Math.random() * accentEmojis.length)];
                piece.style.fontSize = (5 + Math.random() * 7) + 'px';
                piece.style.color = color;
                piece.style.background = 'none';
            } else if (roll < 0.35) {
                // tiny dots
                piece.className = 'diwali-confetti-piece is-paper';
                var d = 2 + Math.random() * 3;
                piece.style.width = d + 'px';
                piece.style.height = d + 'px';
                piece.style.borderRadius = '50%';
                piece.style.background = color;
            } else {
                // tiny paper strips / squares
                piece.className = 'diwali-confetti-piece is-paper';
                var w = 2 + Math.random() * 4;
                var h = 3 + Math.random() * 5;
                piece.style.width = w + 'px';
                piece.style.height = h + 'px';
                piece.style.borderRadius = Math.random() > 0.5 ? '1px' : '0';
                piece.style.background = color;
            }

            // Start from TOP of viewport, spread across full width
            var startX = Math.random() * window.innerWidth;
            var startY = -20 - Math.random() * 120;
            piece.style.position = 'fixed';
            piece.style.left = startX + 'px';
            piece.style.top = startY + 'px';
            piece.style.margin = '0';
            piece.style.opacity = '0';

            // Fall downward with slight horizontal drift
            var driftX = (Math.random() * 120 - 60).toFixed(0) + 'px';
            var fallY = (window.innerHeight + 80 + Math.random() * 200).toFixed(0) + 'px';
            var spin = (180 + Math.random() * 700).toFixed(0) + 'deg';
            piece.style.setProperty('--drift-x', driftX);
            piece.style.setProperty('--fall-y', fallY);
            piece.style.setProperty('--spin', spin);

            piece.style.animationName = 'diwaliConfettiRain';
            piece.style.animationTimingFunction = 'cubic-bezier(0.25, 0.1, 0.25, 1)';
            piece.style.animationFillMode = 'forwards';
            // Stagger so it looks like continuous rain from above
            piece.style.animationDelay = (Math.random() * 1.4) + 's';
            piece.style.animationDuration = (2.8 + Math.random() * 2.6) + 's';

            layer.appendChild(piece);
        }

        // Cleanup after all have fallen
        setTimeout(function () {
            if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
        }, 6500);
    }


    /* --- FINAL PHOTO: ambient when section visible --- */
    function initPersonalConfetti() {
        if (confettiReduced) return;
        var section = document.getElementById('personal-greeting') ||
            document.querySelector('.personal-diwali-section');
        if (!section) return;

        var layer = document.createElement('div');
        layer.className = 'personal-confetti-layer';
        layer.setAttribute('aria-hidden', 'true');
        section.style.position = section.style.position || 'relative';
        section.appendChild(layer);

        var count = confettiMobile ? 55 : 100;
        for (var i = 0; i < count; i++) {
            var piece = makeTinyPiece(PAPER_COLORS);
            piece.classList.add('home-float-piece');
            piece.style.left = (Math.random() * 100) + '%';
            piece.style.top = (Math.random() * 100) + '%';
            piece.style.animationDelay = (Math.random() * 7) + 's';
            piece.style.animationDuration = (7 + Math.random() * 9) + 's';
            piece.style.opacity = String(0.3 + Math.random() * 0.45);
            layer.appendChild(piece);
        }

        layer.style.display = 'none';
        if ('IntersectionObserver' in window) {
            var obs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    layer.style.display = entry.isIntersecting ? '' : 'none';
                });
            }, { threshold: 0.15 });
            obs.observe(section);
        } else {
            layer.style.display = '';
        }
    }

    // Init ambient layers on load
    initHomeConfetti();
    initPersonalConfetti();


    

    /* ---------- Video controls: hide download / PiP where supported ---------- */
    (function protectStoryVideo() {
        var v = document.getElementById('openingCinematicVideo');
        if (!v) return;
        v.setAttribute('controlsList', 'nodownload noremoteplayback');
        v.setAttribute('disablePictureInPicture', '');
        try { v.disablePictureInPicture = true; } catch (e) {}
        // Discourage right-click save on the player (does not stop determined users)
        v.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
    })();

    
    /* Watch in new tab — lightweight player without download control */
    (function () {
        var link = document.querySelector('.watch-new-tab');
        if (!link) return;
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var src = link.getAttribute('href') || 'Assets/videos/scenes/diwali-rama-story-40sec.mp4';
            var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
                '<title>Diwali Story</title><style>html,body{margin:0;height:100%;background:#0a0604;display:flex;align-items:center;justify-content:center}' +
                'video{max-width:100%;max-height:100%;width:100%;outline:none}</style></head><body>' +
                '<video controls autoplay playsinline controlslist="nodownload noplaybackrate" disablepictureinpicture disableremoteplayback ' +
                'src="' + src.replace(/"/g, '') + '"></video></body></html>';
            var w = window.open('', '_blank');
            if (w) {
                w.document.write(html);
                w.document.close();
                w.onload = function () {
                    var v = w.document.querySelector('video');
                    if (v) { v.playbackRate = 0.75; v.defaultPlaybackRate = 0.75; }
                };
            } else {
                // popup blocked — fall back to direct file
                window.open(src, '_blank');
            }
        });
    })();

    console.log('🪔 Diwali cinematic experience loaded.');
})();