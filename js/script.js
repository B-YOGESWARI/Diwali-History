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

    // Use a slower default playback speed for all videos on this page.
    [globalBgVideo, openingCinematicVideo, homeVideo].filter(Boolean).forEach(function (video) {
        video.defaultPlaybackRate = 0.75;
        video.playbackRate = 0.75;
        if (video === openingCinematicVideo) video.loop = true;
        video.addEventListener('loadedmetadata', function () {
            video.playbackRate = 0.75;
            if (video === openingCinematicVideo) video.loop = true;
        });
    });



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

        }, 850);



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



    /* ---------- Soft glowing particle trail + click burst ---------- */
    (function initFestivePointerEffects() {
        const colors = ['#ffe066', '#ffb703', '#fb8500', '#f25c54', '#ff4d6d', '#c9184a', '#4ecdc4', '#48bfe3', '#9b5de5'];
        let lastTrail = 0;

        function makeGlow(x, y, burst = false) {
            const particle = document.createElement('span');
            particle.className = burst ? 'diwali-pointer-particle is-burst' : 'diwali-pointer-particle';
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = burst ? (4 + Math.random() * 7) : (5 + Math.random() * 8);
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.setProperty('--pointer-color', color);
            particle.style.setProperty('--pointer-x', ((Math.random() - 0.5) * (burst ? 170 : 48)) + 'px');
            particle.style.setProperty('--pointer-y', ((Math.random() - 0.5) * (burst ? 170 : 48)) + 'px');
            particle.style.setProperty('--particle-life', (burst ? (0.8 + Math.random() * 0.5) : (1.1 + Math.random() * 0.7)) + 's');
            document.body.appendChild(particle);
            particle.addEventListener('animationend', () => particle.remove(), { once: true });
            window.setTimeout(() => particle.remove(), burst ? 1500 : 2000);
        }

        window.addEventListener('mousemove', function (event) {
            const now = performance.now();
            if (now - lastTrail < 32) return;
            lastTrail = now;
            makeGlow(event.clientX, event.clientY, false);
            // A few occasional companion glows create the soft, floating look in the reference.
            if (Math.random() < 0.34) {
                makeGlow(event.clientX + (Math.random() - 0.5) * 14, event.clientY + (Math.random() - 0.5) * 14, false);
            }
        }, { passive: true });

        window.addEventListener('click', function (event) {
            for (let i = 0; i < 26; i++) makeGlow(event.clientX, event.clientY, true);
        }, { passive: true });
    })();

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



    // Open the Rama story video in a separate browser tab.
    const openVideoInNewTabButton = document.getElementById('openVideoInNewTab');
    if (openVideoInNewTabButton) {
        openVideoInNewTabButton.addEventListener('click', function () {
            window.open('Assets/videos/scenes/diwali-rama-story-40sec.mp4', '_blank', 'noopener');
        });
    }

    /* =========================================================
       FESTIVE PAPER CONFETTI — HOME, SURPRISE, FINAL PHOTO
       Kept separate from the existing navigation/video effects.
    ========================================================= */
    (function initFestivePaperConfetti() {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const mobile = window.matchMedia('(max-width: 768px)').matches;
        const paperColors = ['#ff4d6d','#ff2d55','#ff8fab','#ff9500','#ffd60a','#ffe566','#ffcc00','#d9a441','#30d158','#80ffdb','#0a84ff','#4cc9f0','#af52de','#c77dff'];

        function makePaper(container, className) {
            const piece = document.createElement('span');
            piece.className = 'diwali-paper-piece ' + (className || '');
            const color = paperColors[Math.floor(Math.random() * paperColors.length)];
            const width = 2 + Math.random() * 2;
            const height = 3 + Math.random() * 3;
            piece.style.left = (Math.random() * 100) + '%';
            piece.style.top = (Math.random() * 100) + '%';
            piece.style.width = width + 'px';
            piece.style.height = height + 'px';
            piece.style.background = color;
            piece.style.animationDelay = (-Math.random() * 12) + 's';
            piece.style.animationDuration = (5 + Math.random() * 9) + 's';
            piece.style.setProperty('--paper-drift', (Math.random() * 120 - 60) + 'px');
            piece.style.setProperty('--paper-spin', (Math.random() * 900 - 450) + 'deg');
            container.appendChild(piece);
            return piece;
        }

        function addAmbientPapers(section, className, count) {
            if (!section || reducedMotion || section.querySelector('.' + className)) return;
            const layer = document.createElement('div');
            layer.className = className;
            layer.setAttribute('aria-hidden', 'true');
            section.appendChild(layer);
            for (let i = 0; i < count; i++) makePaper(layer, 'ambient-paper');
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver(entries => {
                    entries.forEach(entry => { layer.style.visibility = entry.isIntersecting ? 'visible' : 'hidden'; });
                }, { threshold: 0.01 });
                observer.observe(section);
            }
        }

        // 1) Continuous colourful papers on the Home hero.
        const home = document.getElementById('home') || document.querySelector('.hero-section');
        addAmbientPapers(home, 'home-confetti-layer', mobile ? 75 : 145);

        // 2) Confetti burst when the Surprise button is clicked.
        function launchSurprisePaperBurst() {
            if (reducedMotion) return;
            const layer = document.createElement('div');
            layer.className = 'diwali-confetti-layer surprise-paper-burst';
            layer.setAttribute('aria-hidden', 'true');
            document.body.appendChild(layer);
            const total = mobile ? 130 : 220;
            for (let i = 0; i < total; i++) {
                const p = makePaper(layer, 'burst-paper');
                p.style.left = (Math.random() * 100) + 'vw';
                p.style.top = (-10 - Math.random() * 35) + 'px';
                p.style.animationDelay = (Math.random() * 1.1) + 's';
                p.style.animationDuration = (2.8 + Math.random() * 2.5) + 's';
                p.style.setProperty('--paper-fall', (window.innerHeight + 100 + Math.random() * 250) + 'px');
            }
            window.setTimeout(() => layer.remove(), 6500);
        }
        if (surpriseButton) {
            surpriseButton.addEventListener('click', launchSurprisePaperBurst, { once: false });
        }

        // 3) Ambient paper decorations around the final personal photo.
        const finalPhoto = document.getElementById('personal-greeting');
        addAmbientPapers(finalPhoto, 'personal-confetti-layer', mobile ? 55 : 100);
    })();

    console.log('🪔 Diwali cinematic experience loaded.');

})();


/* ASK ABOUT DIWALI — exclusive view mode */
(function () {
  'use strict';
  function initAskDiwaliExclusiveView() {
    const section = document.getElementById('ask-diwali');
    const nav = document.getElementById('mainNav');
    const askLink = nav && nav.querySelector('a[href="#ask-diwali"]');
    if (!section || !askLink) return;

    const form = document.getElementById('diwaliQuestionForm');
    const input = document.getElementById('diwaliQuestion');
    const answer = document.getElementById('diwaliAnswer');
    const answerTitle = document.getElementById('diwaliAnswerTitle');
    const answerText = document.getElementById('diwaliAnswerText');
    const historicalNote = document.getElementById('diwaliHistoricalNote');
    const status = document.getElementById('diwaliQuestionStatus');
    const results = document.getElementById('diwaliSearchResults');

    const knowledge = [
      { title: 'What is Diwali?', keys: ['what is diwali', 'meaning of diwali', 'deepavali', 'festival of lights'], text: 'Diwali, also called Deepavali, is a major Indian festival often known as the Festival of Lights. Families light lamps, decorate their homes, share sweets, gather with loved ones, and mark the victory of light over darkness and good over evil. Celebrations vary by region and community.', note: 'Diwali is celebrated over several days. Dates and customs vary by regional calendar and tradition.' },
      { title: 'Rama and the return to Ayodhya', keys: ['rama', 'ramayana', 'ayodhya', 'return', 'lord ram'], text: 'In a widely told North Indian tradition, Diwali commemorates Rama, Sita, and Lakshmana returning to Ayodhya after Rama’s 14-year exile and the defeat of Ravana. The people are said to have welcomed them by lighting rows of oil lamps. This is one of several stories associated with Diwali.', note: 'Diwali has different religious and historical associations across India; the Rama story is especially prominent in many Hindu traditions.' },
      { title: 'Diwali traditions', keys: ['tradition', 'custom', 'rangoli', 'diyas', 'lamps', 'sweets', 'fireworks'], text: 'Common traditions include cleaning and decorating homes, drawing rangoli, lighting diyas, exchanging sweets and gifts, wearing festive clothes, visiting family, and offering prayers. Practices vary across regions and families.', note: 'Some communities choose quieter or more environmentally considerate celebrations.' },
      { title: 'Lakshmi Puja', keys: ['lakshmi', 'puja', 'prayer', 'worship', 'prosperity'], text: 'Lakshmi Puja is an important Diwali observance for many Hindu families. People pray to Goddess Lakshmi, associated with prosperity and good fortune, and often also worship Ganesha. Homes and prayer spaces may be cleaned and decorated, and lamps are lit.', note: 'The timing and exact rituals depend on local customs and family tradition.' },
      { title: 'Why are lamps lit?', keys: ['lamp', 'light', 'diyas', 'darkness', 'why lights'], text: 'Lamps are a central symbol of Diwali. They can represent hope, knowledge, welcome, and the triumph of light over darkness. In the Rama tradition, lamps also welcome Rama and Sita home to Ayodhya.', note: 'The meaning of lamps can vary with the story and community being celebrated.' }
    ];

    function closeAsk() {
      section.hidden = true;
      section.classList.remove('is-active');
      document.body.classList.remove('ask-diwali-mode');
      askLink.setAttribute('aria-expanded', 'false');
    }

    function openAsk(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      section.hidden = false;
      section.classList.add('is-active');
      document.body.classList.add('ask-diwali-mode');
      askLink.setAttribute('aria-expanded', 'true');
      if (nav) nav.classList.remove('open');
      const toggle = document.getElementById('navToggle');
      if (toggle) {
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.setTimeout(() => { if (input) input.focus({ preventScroll: true }); }, 350);
    }

    askLink.addEventListener('click', openAsk, true);
    nav.querySelectorAll('a[href^="#"]:not([href="#ask-diwali"])').forEach(link => {
      link.addEventListener('click', closeAsk, true);
    });
    const brand = document.querySelector('.brand[href="#home"]');
    if (brand) brand.addEventListener('click', closeAsk, true);

    function renderAnswer(question) {
      const q = question.toLowerCase().trim();
      let matches = knowledge.filter(item => item.keys.some(key => q.includes(key) || key.includes(q)));
      if (!matches.length) matches = knowledge.filter(item => item.title.toLowerCase().includes(q) || item.text.toLowerCase().includes(q));
      if (!matches.length) {
        if (status) status.textContent = 'Try a suggested question about Diwali, Rama and Ayodhya, traditions, or Lakshmi Puja.';
        if (answer) answer.hidden = false;
        if (answerTitle) answerTitle.textContent = 'Try a related question';
        if (answerText) answerText.textContent = 'Choose one of the suggested questions or try a shorter phrase.';
        if (historicalNote) { historicalNote.hidden = true; historicalNote.textContent = ''; }
        if (results) results.replaceChildren();
        return;
      }
      const first = matches[0];
      if (answer) answer.hidden = false;
      if (answerTitle) answerTitle.textContent = first.title;
      if (answerText) answerText.textContent = first.text;
      if (historicalNote) { historicalNote.hidden = !first.note; historicalNote.textContent = first.note; }
      if (status) status.textContent = 'Answer ready.';
      if (results) {
        results.replaceChildren();
        matches.slice(1).forEach(item => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'diwali-related-result';
          button.textContent = item.title;
          button.addEventListener('click', () => { if (input) input.value = item.title; renderAnswer(item.title); });
          results.appendChild(button);
        });
      }
    }

    if (form) form.addEventListener('submit', event => {
      event.preventDefault();
      const question = input ? input.value.trim() : '';
      if (!question) { if (status) status.textContent = 'Please enter a question about Diwali.'; return; }
      renderAnswer(question);
    });
    section.querySelectorAll('[data-question]').forEach(button => {
      button.addEventListener('click', () => {
        const question = button.getAttribute('data-question') || button.textContent.trim();
        if (input) input.value = question;
        renderAnswer(question);
      });
    });
    closeAsk();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAskDiwaliExclusiveView, { once: true });
  else initAskDiwaliExclusiveView();
})();

