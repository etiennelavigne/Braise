/* ==========================================================================
   BRAISE — INTERACTIVE ENGINE (VANILLA JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. NATIVE CURSOR (Custom cursor disabled for cleaner look)

    // 2. SCROLL PROGRESS INDICATOR
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = `${scrolled}%`;
        }
    });

    // 3. MOBILE MENU TOGGLE
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (menuToggle && mobileOverlay) {
        const toggleMenu = () => {
            menuToggle.classList.toggle('open');
            mobileOverlay.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        };

        menuToggle.addEventListener('click', toggleMenu);

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                mobileOverlay.classList.remove('open');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // 4. HERO SECTION: INTERACTIVE DECK HOVER LINKAGE
    const deckCards = document.querySelectorAll('.deck-card');
    deckCards.forEach(card => {
        const targetName = card.getAttribute('data-lever-target');
        
        card.addEventListener('mouseenter', () => {
            // Highlight matching funnel step visual in Leviers section
            const matchingStep = document.querySelector(`.funnel-step-visual[data-step="${targetName}"]`);
            if (matchingStep) matchingStep.classList.add('active');
        });
        
        card.addEventListener('mouseleave', () => {
            const matchingStep = document.querySelector(`.funnel-step-visual[data-step="${targetName}"]`);
            if (matchingStep) matchingStep.classList.remove('active');
        });
    });

    // 5. SECTION 02: LEVIERS LINKAGE
    const leverCards = document.querySelectorAll('.lever-card');
    const funnelSteps = document.querySelectorAll('.funnel-step-visual');

    leverCards.forEach(card => {
        const targetName = card.getAttribute('data-lever-target');

        card.addEventListener('mouseenter', () => {
            card.classList.add('highlighted');
            
            // Highlight funnel step visual on the left
            const matchingStep = document.querySelector(`.funnel-step-visual[data-step="${targetName}"]`);
            if (matchingStep) matchingStep.classList.add('active');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('highlighted');
            
            const matchingStep = document.querySelector(`.funnel-step-visual[data-step="${targetName}"]`);
            if (matchingStep) matchingStep.classList.remove('active');
        });
    });

    // 6. SECTION 03: NOTRE ACCOMPAGNEMENT (TIMELINE SCROLL DRAW)
    const timelineWrapper = document.querySelector('.timeline-wrapper');
    const timelineSteps = document.querySelectorAll('.timeline-step');
    const timelineActiveLine = document.querySelector('.scroll-timeline-line-active');

    if (timelineWrapper && timelineActiveLine) {
        window.addEventListener('scroll', () => {
            const wrapperRect = timelineWrapper.getBoundingClientRect();
            const wrapperHeight = timelineWrapper.offsetHeight;
            const windowHeight = window.innerHeight;
            
            // Calculate active timeline line percentage based on scroll viewport position
            const triggerPoint = windowHeight / 2; // Midpoint of viewport
            const relativeOffset = triggerPoint - wrapperRect.top;
            
            let percent = 0;
            if (relativeOffset > 0) {
                percent = Math.min((relativeOffset / wrapperHeight) * 100, 100);
            }
            
            timelineActiveLine.style.height = `${percent}%`;

            // Active step triggers
            timelineSteps.forEach(step => {
                const stepRect = step.getBoundingClientRect();
                if (stepRect.top < windowHeight * 0.55) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });
        });
    }

    // 7. SECTION 05: RÉALISATIONS (CASE STUDY SLIDER)
    const sliderTrack = document.getElementById('slider-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const progressBar = document.getElementById('slider-progress-active');
    
    if (sliderTrack && prevBtn && nextBtn) {
        let currentTranslate = 0;
        let slideWidth = 420 + 32; // card width + gap (2rem = 32px)
        let isDragging = false;
        let startPos = 0;
        let prevTranslate = 0;
        
        // Handle responsive screen adjustments
        const updateSlideWidth = () => {
            const card = document.querySelector('.case-card');
            if (card) {
                const cardWidth = card.offsetWidth;
                const style = window.getComputedStyle(sliderTrack);
                const gap = parseInt(style.columnGap || style.gap || '32');
                slideWidth = cardWidth + gap;
            }
        };
        updateSlideWidth();
        window.addEventListener('resize', updateSlideWidth);

        const getTrackMaxTranslate = () => {
            const containerWidth = sliderTrack.parentElement.offsetWidth;
            const trackWidth = sliderTrack.scrollWidth;
            return Math.min(0, containerWidth - trackWidth);
        };

        const updateProgressBar = () => {
            const maxScroll = getTrackMaxTranslate();
            if (maxScroll === 0) {
                progressBar.style.width = '100%';
                progressBar.style.left = '0%';
                return;
            }
            const percent = (currentTranslate / maxScroll) * 100;
            // Bar width fits slider viewport (30%) and moves across
            progressBar.style.width = '30%';
            progressBar.style.left = `${percent * 0.7}%`;
        };

        const setSliderPosition = () => {
            sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
            updateProgressBar();
        };

        // Navigation controls click
        nextBtn.addEventListener('click', () => {
            const maxScroll = getTrackMaxTranslate();
            currentTranslate -= slideWidth;
            if (currentTranslate < maxScroll) currentTranslate = maxScroll;
            setSliderPosition();
            prevTranslate = currentTranslate;
        });

        prevBtn.addEventListener('click', () => {
            currentTranslate += slideWidth;
            if (currentTranslate > 0) currentTranslate = 0;
            setSliderPosition();
            prevTranslate = currentTranslate;
        });

        // Touch & Drag controls
        const getPositionX = (event) => {
            return event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
        };

        const dragStart = (event) => {
            isDragging = true;
            startPos = getPositionX(event);
            sliderTrack.style.transition = 'none';
        };

        const dragMove = (event) => {
            if (!isDragging) return;
            const currentPosition = getPositionX(event);
            const diff = currentPosition - startPos;
            currentTranslate = prevTranslate + diff;
            
            // Limit bounds with resistance
            const maxScroll = getTrackMaxTranslate();
            if (currentTranslate > 0) {
                currentTranslate = currentTranslate * 0.3; // bounce resistance
            } else if (currentTranslate < maxScroll) {
                currentTranslate = maxScroll + (currentTranslate - maxScroll) * 0.3;
            }
            
            sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
        };

        const dragEnd = () => {
            isDragging = false;
            sliderTrack.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            
            // Snap to nearest slide
            const nearestSlide = Math.round(currentTranslate / slideWidth);
            currentTranslate = nearestSlide * slideWidth;
            
            const maxScroll = getTrackMaxTranslate();
            if (currentTranslate > 0) currentTranslate = 0;
            if (currentTranslate < maxScroll) currentTranslate = maxScroll;
            
            setSliderPosition();
            prevTranslate = currentTranslate;
        };

        sliderTrack.addEventListener('mousedown', dragStart);
        sliderTrack.addEventListener('mousemove', dragMove);
        window.addEventListener('mouseup', dragEnd);

        sliderTrack.addEventListener('touchstart', dragStart);
        sliderTrack.addEventListener('touchmove', dragMove);
        window.addEventListener('touchend', dragEnd);
        
        // Initial setup
        updateProgressBar();
    }

    // 7.5 — FAQ ACCORDION LOGIC
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const answer = item.querySelector('.faq-answer');

        if (trigger && answer) {
            trigger.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                
                // Fermer les autres éléments pour un effet accordéon propre
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('open');
                        const otherTrigger = otherItem.querySelector('.faq-trigger');
                        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) otherAnswer.style.maxHeight = null;
                    }
                });

                // Basculer l'état de l'élément cliqué
                if (isOpen) {
                    item.classList.remove('open');
                    trigger.setAttribute('aria-expanded', 'false');
                    answer.style.maxHeight = null;
                } else {
                    item.classList.add('open');
                    trigger.setAttribute('aria-expanded', 'true');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });

    // 8. CONTACT MODAL & FORM INGEST
    const modalTriggers = document.querySelectorAll('.btn-contact-trigger');
    const contactModal = document.getElementById('contact-modal');
    const successModal = document.getElementById('success-modal');
    const modalClose = document.querySelector('.modal-close');
    const projectForm = document.getElementById('project-form');
    const formStatus = document.getElementById('form-status');
    const successClose = document.querySelector('.success-close-btn');

    const openModal = (e) => {
        if (e) e.preventDefault();
        if (contactModal) {
            contactModal.classList.add('open');
            document.body.classList.add('no-scroll');
        }
    };

    const closeModal = () => {
        if (contactModal) contactModal.classList.remove('open');
        if (successModal) successModal.classList.remove('open');
        document.body.classList.remove('no-scroll');
    };

    modalTriggers.forEach(trigger => trigger.addEventListener('click', openModal));
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (successClose) successClose.addEventListener('click', closeModal);

    // Close on background click
    window.addEventListener('click', (e) => {
        if (e.target === contactModal) closeModal();
        if (e.target === successModal) closeModal();
    });

    // Form submit mockup
    if (projectForm) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect Form data
            const formData = new FormData(projectForm);
            const selectedLevers = formData.getAll('levers');
            const name = formData.get('name');
            const email = formData.get('email');
            const company = formData.get('company');
            const message = formData.get('message');

            if (formStatus) {
                formStatus.style.color = '#ff5500';
                formStatus.textContent = 'Enregistrement de votre demande en cours...';
            }

            // Simulate server network dispatch
            setTimeout(() => {
                // Log formatted structure matching client project tracking
                console.log('--- BRAISE INCOMING INQUIRY ---');
                console.log(`Company: ${company}`);
                console.log(`Contact: ${name} (${email})`);
                console.log(`Levers requested: ${selectedLevers.join(', ') || 'Aucun sélectionné'}`);
                console.log(`Message: ${message}`);
                console.log('-------------------------------');

                // Toggle Modals
                if (contactModal) contactModal.classList.remove('open');
                if (successModal) successModal.classList.add('open');
                
                projectForm.reset();
                if (formStatus) formStatus.textContent = '';
            }, 1200);
        });
    }

    // 9. SCROLL REVEAL (INTERSECTION OBSERVER)
    const revealElements = document.querySelectorAll('.fade-in-up, .why-item');
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target); // Trigger once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before element hits viewport
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

    // Custom CSS layout style override for no-scroll
    const style = document.createElement('style');
    style.innerHTML = `
        body.no-scroll {
            overflow: hidden !important;
            height: 100vh !important;
        }
    `;
    document.head.appendChild(style);
});
