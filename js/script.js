/* =========================================================
   DIWALI â€” A Journey Through Light
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
    const homeVideo = document.getElementById('homeBackgroundVideo') || globalBgVideo;

    // Keep videos at a slower cinematic playback speed.
    [globalBgVideo, openingCinematicVideo, homeVideo]
        .filter(Boolean)
        .forEach(function (video) {
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

    /* ---------- Mobile navigation ---------- */

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function () {
            const isOpen = mainNav.classList.toggle('open');

            navToggle.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
            navToggle.setAttribute(
                'aria-label',
                isOpen ? 'Close navigation' : 'Open navigation'
            );
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
            const top = target.getBoundingClientRect().top +
                window.pageYOffset - headerHeight;

            window.scrollTo({
                top: Math.max(0, top),
                behavior: 'smooth'
            });
        });
    });

    /* ---------- Global background video ---------- */

    function playGlobalBg() {
        const video = globalBgVideo || homeVideo;
        if (!video) return;

        video.muted = true;

        const promise = video.play();
        if (promise && promise.catch) promise.catch(function () {});
    }

    playGlobalBg();
    window.addEventListener('load', playGlobalBg, { once: true });

    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) playGlobalBg();
    });

    /* ---------- Scroll reveal animations ---------- */

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

        revealElements.forEach(function (element) {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(function (element) {
            element.classList.add('visible');
        });
    }

    /* ---------- Surprise confetti ---------- */

    function createExtraConfetti() {
        if (!surpriseDecorations) return;

        surpriseDecorations.querySelectorAll('.paper').forEach(function (paper, index) {
            paper.style.left = Math.random() * 96 + '%';
            paper.style.setProperty('--i', index + 1);
            paper.style.animationDelay = Math.random() * 0.8 + 's';
            paper.style.animationDuration = 2.8 + Math.random() * 1.8 + 's';
        });
    }

    /* ---------- Floating celebration ---------- */

    function createFloatingCelebration() {
        const emojis = ['âœ¨', 'ðŸª”', 'ðŸŒ¸', 'ðŸŒ¼', 'ðŸŽ†', 'ðŸŽ‡', 'ðŸ’«', 'ðŸª·', 'â­', 'ðŸŒº'];
        const container = document.createElement('div');

        container.className = 'temporary-diwali-celebration';
        container.setAttribute('aria-hidden', 'true');

        for (let i = 0; i < 35; i++) {
            const element = document.createElement('span');

            element.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            element.style.left = Math.random() * 100 + '%';
            element.style.fontSize = 18 + Math.random() * 26 + 'px';
            element.style.animationDelay = Math.random() * 1.2 + 's';
            element.style.animationDuration = 2.5 + Math.random() * 2.5 + 's';
            element.style.animationName = 'diwaliFloat';
            element.style.animationTimingFunction = 'ease-out';
            element.style.animationFillMode = 'forwards';

            container.appendChild(element);
        }

        document.body.appendChild(container);
        setTimeout(function () { container.remove(); }, 5500);
    }

    /* ---------- Surprise video ---------- */

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
        } catch (error) {
            console.warn('Unable to reset video:', error);
        }

        const promise = openingCinematicVideo.play();

        if (promise && promise.catch) {
            promise.catch(function (error) {
                console.warn('Autoplay blocked. Use video controls:', error);
            });
        }
    }

    let surpriseAlreadyPlayed = false;

    function triggerDiwaliSurprise() {
        if (!surpriseButton || surpriseAlreadyPlayed) return;

        surpriseAlreadyPlayed = true;
        surpriseButton.classList.add('opened', 'surprise-opened');

        if (surpriseDecorations) {
            surpriseDecorations.classList.add('active');
            createExtraConfetti();
        }

        createFloatingCelebration();

        setTimeout(function () {
            if (cinematicVideoWrapper) {
                cinematicVideoWrapper.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
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
                    journey.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
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
                'Diwali video could not load:',
                'Assets/videos/scenes/diwali-rama-story-40sec.mp4'
            );
        });
    }

    /* ---------- Pointer glow effects ---------- */

    (function initFestivePointerEffects() {
        const colors = [
            '#ffe066', '#ffb703', '#fb8500', '#f25c54',
            '#ff4d6d', '#c9184a', '#4ecdc4', '#48bfe3', '#9b5de5'
        ];

        let lastTrail = 0;

        function makeGlow(x, y, burst = false) {
            const particle = document.createElement('span');

            particle.className = burst
                ? 'diwali-pointer-particle is-burst'
                : 'diwali-pointer-particle';

            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = burst ? 4 + Math.random() * 7 : 5 + Math.random() * 8;

            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.setProperty('--pointer-color', color);
            particle.style.setProperty(
                '--pointer-x',
                (Math.random() - 0.5) * (burst ? 170 : 48) + 'px'
            );
            particle.style.setProperty(
                '--pointer-y',
                (Math.random() - 0.5) * (burst ? 170 : 48) + 'px'
            );
            particle.style.setProperty(
                '--particle-life',
                (burst ? 0.8 + Math.random() * 0.5 : 1.1 + Math.random() * 0.7) + 's'
            );

            document.body.appendChild(particle);
            particle.addEventListener('animationend', function () {
                particle.remove();
            }, { once: true });

            setTimeout(function () { particle.remove(); }, burst ? 1500 : 2000);
        }

        window.addEventListener('mousemove', function (event) {
            const now = performance.now();
            if (now - lastTrail < 32) return;

            lastTrail = now;
            makeGlow(event.clientX, event.clientY);

            if (Math.random() < 0.34) {
                makeGlow(
                    event.clientX + (Math.random() - 0.5) * 14,
                    event.clientY + (Math.random() - 0.5) * 14
                );
            }
        }, { passive: true });

        window.addEventListener('click', function (event) {
            for (let i = 0; i < 26; i++) {
                makeGlow(event.clientX, event.clientY, true);
            }
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
                particle.style.transform =
                    'translate(' + x * factor + 'px, ' + y * factor + 'px)';
            });
        }, { passive: true });
    }

    /* ---------- Today particles ---------- */

    const todaySection = document.getElementById('today');

    if (todaySection) {
        todaySection.querySelectorAll('.today-particles span').forEach(function (particle, index) {
            particle.style.animationDelay = index * 0.35 + 's';
        });
    }

    /* ---------- Page load ---------- */

    window.addEventListener('load', function () {
        document.body.classList.add('page-loaded');

        if (openingCinematicVideo) {
            openingCinematicVideo.pause();

            try {
                openingCinematicVideo.currentTime = 0;
            } catch (error) {}
        }
    });

    /* ---------- Reduced motion ---------- */

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.cinematic-reveal').forEach(function (element) {
            element.classList.add('visible');
        });
    }

    /* =========================================================
       CHAPTER ACCORDION
    ========================================================= */

    const chapterRows = document.querySelectorAll('.chapter-row');

    function closeAllChapters(except) {
        chapterRows.forEach(function (row) {
            if (except && row === except) return;

            row.classList.remove('is-open');

            const button = row.querySelector('.chapter-trigger');
            const panel = row.querySelector('.chapter-panel');

            if (button) button.setAttribute('aria-expanded', 'false');
            if (panel) panel.hidden = true;
        });
    }

    function openChapter(row) {
        closeAllChapters(row);
        row.classList.add('is-open');

        const button = row.querySelector('.chapter-trigger');
        const panel = row.querySelector('.chapter-panel');

        if (button) button.setAttribute('aria-expanded', 'true');
        if (panel) panel.hidden = false;

        setTimeout(function () {
            const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
            const top = row.getBoundingClientRect().top +
                window.pageYOffset - headerHeight - 12;

            window.scrollTo({
                top: Math.max(0, top),
                behavior: 'smooth'
            });
        }, 80);
    }

    chapterRows.forEach(function (row) {
        const button = row.querySelector('.chapter-trigger');
        if (!button) return;

        button.addEventListener('click', function () {
            if (row.classList.contains('is-open')) {
                closeAllChapters(null);
            } else {
                openChapter(row);
            }
        });
    });

    const openVideoButton = document.getElementById('openVideoInNewTab');

    if (openVideoButton) {
        openVideoButton.addEventListener('click', function () {
            window.open(
                'Assets/videos/scenes/diwali-rama-story-40sec.mp4',
                '_blank',
                'noopener'
            );
        });
    }

    /* ---------- Festive paper confetti ---------- */

    (function initFestivePaperConfetti() {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const mobile = window.matchMedia('(max-width: 768px)').matches;

        const paperColors = [
            '#ff4d6d', '#ff2d55', '#ff8fab', '#ff9500',
            '#ffd60a', '#ffe566', '#ffcc00', '#d9a441',
            '#30d158', '#80ffdb', '#0a84ff', '#4cc9f0',
            '#af52de', '#c77dff'
        ];

        function makePaper(container, className) {
            const piece = document.createElement('span');

            piece.className = 'diwali-paper-piece ' + (className || '');

            piece.style.left = Math.random() * 100 + '%';
            piece.style.top = Math.random() * 100 + '%';
            piece.style.width = 2 + Math.random() * 2 + 'px';
            piece.style.height = 3 + Math.random() * 3 + 'px';
            piece.style.background =
                paperColors[Math.floor(Math.random() * paperColors.length)];
            piece.style.animationDelay = -Math.random() * 12 + 's';
            piece.style.animationDuration = 5 + Math.random() * 9 + 's';
            piece.style.setProperty(
                '--paper-drift',
                (Math.random() * 120 - 60) + 'px'
            );
            piece.style.setProperty(
                '--paper-spin',
                (Math.random() * 900 - 450) + 'deg'
            );

            container.appendChild(piece);
            return piece;
        }

        function addAmbientPapers(section, className, count) {
            if (!section || reducedMotion || section.querySelector('.' + className)) {
                return;
            }

            const layer = document.createElement('div');
            layer.className = className;
            layer.setAttribute('aria-hidden', 'true');
            section.appendChild(layer);

            for (let i = 0; i < count; i++) {
                makePaper(layer, 'ambient-paper');
            }

            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        layer.style.visibility =
                            entry.isIntersecting ? 'visible' : 'hidden';
                    });
                }, { threshold: 0.01 });

                observer.observe(section);
            }
        }

        const home = document.getElementById('home') ||
            document.querySelector('.hero-section');

        addAmbientPapers(home, 'home-confetti-layer', mobile ? 75 : 145);

        function launchSurprisePaperBurst() {
            if (reducedMotion) return;

            const layer = document.createElement('div');
            layer.className = 'diwali-confetti-layer surprise-paper-burst';
            layer.setAttribute('aria-hidden', 'true');
            document.body.appendChild(layer);

            const total = mobile ? 130 : 220;

            for (let i = 0; i < total; i++) {
                const piece = makePaper(layer, 'burst-paper');

                piece.style.left = Math.random() * 100 + 'vw';
                piece.style.top = (-10 - Math.random() * 35) + 'px';
                piece.style.animationDelay = Math.random() * 1.1 + 's';
                piece.style.animationDuration = 2.8 + Math.random() * 2.5 + 's';
                piece.style.setProperty(
                    '--paper-fall',
                    (window.innerHeight + 100 + Math.random() * 250) + 'px'
                );
            }

            setTimeout(function () { layer.remove(); }, 6500);
        }

        if (surpriseButton) {
            surpriseButton.addEventListener('click', launchSurprisePaperBurst);
        }

        addAmbientPapers(
            document.getElementById('personal-greeting'),
            'personal-confetti-layer',
            mobile ? 55 : 100
        );
    })();

    console.log('ðŸª” Diwali cinematic experience loaded.');
})();


/* =========================================================
   ASK ABOUT DIWALI â€” integrated web-powered assistant
   Uses the existing dark-themed section in index.html.
========================================================= */

(function () {
    'use strict';

    // Local FastAPI endpoint.
    const ASK_API_URL = 'https://YOUR-RENDER-URL.onrender.com/ask';

    function initAskDiwali() {
        const section = document.getElementById('ask-diwali');
        const nav = document.getElementById('mainNav');
        const askLink = nav && nav.querySelector('a[href="#ask-diwali"]');

        if (!section || !askLink) {
            console.warn('Ask Diwali section or navigation link was not found.');
            return;
        }

        const form = document.getElementById('diwaliQuestionForm');
        const input = document.getElementById('diwaliQuestion');
        const button = document.getElementById('diwaliAskButton');
        const answer = document.getElementById('diwaliAnswer');
        const answerTitle = document.getElementById('diwaliAnswerTitle');
        const answerText = document.getElementById('diwaliAnswerText');
        const historicalNote = document.getElementById('diwaliHistoricalNote');
        const status = document.getElementById('diwaliQuestionStatus');
        const results = document.getElementById('diwaliSearchResults');

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

            if (navToggle) {
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Open navigation');
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });

            setTimeout(function () {
                if (input) input.focus({ preventScroll: true });
            }, 350);
        }

        // Capture the Ask link before the general smooth-anchor handler.
        askLink.addEventListener('click', openAsk, true);

        nav.querySelectorAll('a[href^="#"]:not([href="#ask-diwali"])')
            .forEach(function (link) {
                link.addEventListener('click', closeAsk, true);
            });

        const brand = document.querySelector('.brand[href="#home"]');

        if (brand) {
            brand.addEventListener('click', closeAsk, true);
        }

        function showSources(sources) {
            if (!results) return;

            results.replaceChildren();

            if (!Array.isArray(sources) || sources.length === 0) return;

            const heading = document.createElement('h4');
            heading.textContent = 'Sources';
            results.appendChild(heading);

            sources.forEach(function (source) {
                if (!source || typeof source.url !== 'string') return;

                let parsedUrl;

                try {
                    parsedUrl = new URL(source.url);
                } catch {
                    return;
                }

                if (!['https:', 'http:'].includes(parsedUrl.protocol)) return;

                const link = document.createElement('a');
                link.className = 'diwali-related-result';
                link.href = parsedUrl.href;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.textContent = source.title || parsedUrl.hostname;

                results.appendChild(link);

                if (source.snippet) {
                    const snippet = document.createElement('p');
                    snippet.className = 'diwali-source-snippet';
                    snippet.textContent = source.snippet;
                    results.appendChild(snippet);
                }
            });
        }

        async function askQuestion(question) {
            const cleanedQuestion = question.trim();

            if (cleanedQuestion.length < 2) {
                if (status) status.textContent = 'Please enter a question.';
                if (input) input.focus();
                return;
            }

            if (cleanedQuestion.length > 600) {
                if (status) status.textContent = 'Please keep your question under 600 characters.';
                return;
            }

            if (button) {
                button.disabled = true;
                button.textContent = 'Searching the webâ€¦';
            }

            if (status) status.textContent = 'Searching the web for an answerâ€¦';

            if (answer) answer.hidden = false;
            if (answerTitle) answerTitle.textContent = 'Finding your answer';

            if (answerText) {
                answerText.textContent =
                    'Please wait while we search for relevant information.';
            }

            if (historicalNote) {
                historicalNote.hidden = true;
                historicalNote.textContent = '';
            }

            if (results) results.replaceChildren();

            try {
                const response = await fetch(ASK_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        question: cleanedQuestion
                    })
                });

                const data = await response.json().catch(function () {
                    return {};
                });

                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                        'The search service could not answer right now.'
                    );
                }

                if (!data || typeof data.answer !== 'string' || !data.answer.trim()) {
                    throw new Error('The API returned no answer. Please try again.');
                }

                if (answerTitle) answerTitle.textContent = cleanedQuestion;
                if (answerText) answerText.textContent = data.answer;

                showSources(data.sources);

                if (historicalNote) {
                    historicalNote.textContent = data.note || '';
                    historicalNote.hidden = !data.note;
                }

                if (status) status.textContent = 'Answer ready.';

            } catch (error) {
                console.error('Ask Diwali request failed:', error);

                if (answerTitle) {
                    answerTitle.textContent = 'Unable to get an answer';
                }

                if (answerText) {
                    answerText.textContent =
                        error instanceof TypeError
                            ? 'Cannot connect to the Ask Diwali API. Make sure the backend is running at http://127.0.0.1:8001 and that CORS allows this website.'
                            : (error.message || 'Something went wrong. Please try again later.');
                }

                if (status) {
                    status.textContent =
                        'Connection failed. Check the backend terminal and browser console.';
                }

                if (results) results.replaceChildren();

            } finally {
                if (button) {
                    button.disabled = false;
                    button.innerHTML =
                        'Ask Question <span aria-hidden="true">â†’</span>';
                }
            }
        }

        if (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                askQuestion(input ? input.value : '');
            });
        }

        // Suggested questions use the same form and backend.
        section.querySelectorAll('[data-question]').forEach(function (suggestion) {
            suggestion.addEventListener('click', function () {
                const question =
                    suggestion.getAttribute('data-question') ||
                    suggestion.textContent.trim();

                if (input) input.value = question;

                askQuestion(question);
            });
        });

        // Start with the Ask section hidden; open it through the site navigation.
        closeAsk();

        console.log('ðŸª” Ask About Diwali initialized:', ASK_API_URL);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAskDiwali, { once: true });
    } else {
        initAskDiwali();
    }
})();
