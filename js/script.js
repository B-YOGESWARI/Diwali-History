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
    const globalBgVideo = document.getElementById('globalBackgroundVideo');
    // legacy id kept for compatibility if present
    const homeVideo = document.getElementById('homeBackgroundVideo') || globalBgVideo;

    /* ---------- Header scroll ---------- */
    function handleNavigationScroll() {
        if (!siteHeader) return;
        siteHeader.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', handleNavigationScroll, { passive: true });
    handleNavigationScroll();

    /* ---------- Mobile nav ---------- */
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

    /* ---------- Smooth anchors ---------- */
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

    /* ---------- Global Space background video ---------- */
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

    /* ---------- Scroll reveals ---------- */
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

    /* ---------- Confetti papers ---------- */
    function createExtraConfetti() {
        if (!surpriseDecorations) return;
        const papers = surpriseDecorations.querySelectorAll('.paper');
        papers.forEach(function (paper, index) {
            paper.style.left = (Math.random() * 96) + '%';
            paper.style.setProperty('--i', index + 1);
            paper.style.animationDelay = (Math.random() * 0.8) + 's';
            paper.style.animationDuration = (2.8 + Math.random() * 1.8) + 's';
        });
    }

    /* ---------- Floating emoji celebration ---------- */
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

    /* ---------- Start surprise video ---------- */
    function startVideo() {
        if (!openingCinematicVideo) {
            console.warn('openingCinematicVideo not found.');
            return;
        }
        if (cinematicVideoWrapper) {
            cinematicVideoWrapper.classList.add('video-visible');
        }
        try {
            openingCinematicVideo.currentTime = 0;
        } catch (e) {
            console.warn('Unable to reset video:', e);
        }
        const playPromise = openingCinematicVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(function (err) {
                console.warn('Autoplay blocked — use controls to play:', err);
            });
        }
    }

    /* ---------- Open Diwali Surprise ---------- */
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
        }

        createFloatingCelebration();

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
    }

    /* ---------- Video events ---------- */
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
        });
    }

    /* ---------- Hero particle parallax ---------- */
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

    /* ---------- Today particles stagger ---------- */
    const todaySection = document.getElementById('today');
    if (todaySection) {
        todaySection.querySelectorAll('.today-particles span').forEach(function (particle, index) {
            particle.style.animationDelay = (index * 0.35) + 's';
        });
    }

    /* ---------- Page load ---------- */
    window.addEventListener('load', function () {
        document.body.classList.add('page-loaded');
        if (openingCinematicVideo) {
            openingCinematicVideo.pause();
            try {
                openingCinematicVideo.currentTime = 0;
            } catch (e) {}
        }
    });

    /* ---------- Reduced motion ---------- */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.cinematic-reveal').forEach(function (el) {
            el.classList.add('visible');
        });
    }



    /* =========================================================
       COMPACT CHAPTER ACCORDION
       One of Journey / Traditions / Today open at a time
    ========================================================= */

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
        // Soft scroll so expanded panel stays in view
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

    console.log('🪔 Diwali cinematic experience loaded.');
})();
