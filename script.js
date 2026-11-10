/* ==========================================================================
   ANVARSHA. PORTFOLIO INTERACTION SYSTEM
   Pure Vanilla JS with Performant Observers and Terminal Data Hydration
   ========================================================================== */

// ==========================================================================
// 1. DSA STATS CONFIGURATION (EDIT YOUR METRICS HERE IN ONE PLACE)
// ==========================================================================
const DSA_STATS_CONFIG = {
    // TODO: Replace with your actual total problems solved (e.g., "160+", "200")
    problemsSolved: "160+",
    
    // Primary platform(s) for problem solving
    primaryPlatform: "LeetCode / GeeksforGeeks",
    
    // Primary language used for algorithms
    language: "JavaScript",
    
    // TODO: Replace with your active streak (e.g., "18 Days", "30 Days")
    currentStreak: "18 Days",
    
    // Current topic or focus area
    focusArea: "Trees & Dynamic Programming"
};

// ==========================================================================
// 2. CONTACT FORM & EMAIL SERVICE CONFIGURATION
// ==========================================================================
const EMAIL_CONFIG = {
    // --- EmailJS Settings ---
    // 1. Sign up at https://www.emailjs.com/
    // 2. Add an Email Service (e.g., Gmail)
    // 3. Create an Email Template with {{user_name}}, {{user_email}}, {{message}}
    // 4. Fill in your credentials below
    emailjs: {
        publicKey: "0tlpurJ3jEg3FPcbr",   // TODO: Replace with your EmailJS Public Key
        serviceId: "service_vtkr2cn",    // TODO: Replace with your EmailJS Service ID
        templateId: "template_879uhv8"   // TODO: Replace with your EmailJS Template ID
    },
    
    // --- Alternative No-Backend Option: Formspree ---
    // If preferred, create a form at https://formspree.io/ and paste the URL below
    formspreeEndpoint: "" // e.g. "https://formspree.io/f/mqkrwzpq" (leave blank to use EmailJS)
};

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Page Loader ---
    const loader = document.getElementById('pageLoader');
    const triggerHeroAnimations = () => {
        document.body.classList.add('page-loaded');
        const heroElements = document.querySelectorAll('.fade-in-up');
        heroElements.forEach(el => {
            el.style.animation = 'fadeInUp 0.8s var(--ease-editorial) forwards';
        });
    };

    if (loader) {
        setTimeout(() => {
            loader.classList.add('loaded');
            triggerHeroAnimations();
            setTimeout(() => {
                if (loader && loader.parentElement) loader.remove();
            }, 800);
        }, 800);
    } else {
        triggerHeroAnimations();
    }

    // --- 2. Top Scroll-Progress Bar & Auto-Hiding Navbar ---
    const progressBar = document.getElementById('scrollProgressBar');
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        
        // 2a. Update scroll progress bar
        if (progressBar) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                const scrollPercent = Math.min(100, Math.max(0, (currentScrollY / docHeight) * 100));
                progressBar.style.width = `${scrollPercent}%`;
            }
        }

        // 2b. Auto-hide navbar
        if (currentScrollY > 80) {
            if (currentScrollY > lastScrollY) {
                navbar.classList.add('nav-hidden');
            } else {
                navbar.classList.remove('nav-hidden');
            }
        } else {
            navbar.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- 3. Mobile Navigation Menu Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const individualLinks = document.querySelectorAll('.nav-item');

    const toggleMenu = () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking individual mobile links
    individualLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Allow normal navigation for external/file links (e.g., resume PDF)
            if (href.endsWith('.pdf') || href.startsWith('http')) {
                if (navLinks && navLinks.classList.contains('active')) {
                    toggleMenu();
                }
                return;
            }

            e.preventDefault();
            if (navLinks && navLinks.classList.contains('active')) {
                toggleMenu();
            }
            
            setTimeout(() => {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }, 250);
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks && !e.target.closest('.navbar-container') && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });

    // --- 4. Scroll-Spy (Highlight Active Nav Link) ---
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item:not(.nav-resume-btn)');

    const observerOptions = {
        root: null,
        rootMargin: '-25% 0px -55% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    item.classList.remove('active');
                    const linkHref = item.getAttribute('href');
                    if (linkHref === `#${activeId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- 5. Typing Animation (Typewriter Effect) ---
    const initTypingAnimation = () => {
        const target = document.getElementById('typed-text');
        if (!target) return;
        
        // Specified roles cycling order
        const words = ["Full-Stack Developer", "Problem Solver", "MERN Stack Builder"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        const type = () => {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                target.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 45;
            } else {
                target.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 130;
            }
            
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typingSpeed = 2200; // Pause on completed role
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 450; // Pause before typing next role
            }
            
            setTimeout(type, typingSpeed);
        };
        
        type();
    };
    
    initTypingAnimation();

    // --- 6. Subtle Canvas Background Particles System ---
    const initBackgroundParticles = () => {
        const canvas = document.getElementById('heroParticles');
        if (!canvas) return;
        
        // Respect user accessibility preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;
        
        const particles = [];
        const getParticleCount = () => Math.min(45, Math.floor((width * height) / 20000));
        let particleCount = getParticleCount();
        
        const colors = [
            'rgba(0, 212, 255, 0.12)',
            'rgba(184, 255, 87, 0.08)'
        ];
        
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.radius = Math.random() * 2 + 1;
                this.vx = (Math.random() - 0.5) * 0.25;
                this.vy = (Math.random() - 0.5) * 0.25;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }
        
        const spawnParticles = () => {
            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };
        
        spawnParticles();
        
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (!canvas) return;
                width = canvas.width = canvas.offsetWidth;
                height = canvas.height = canvas.offsetHeight;
                particleCount = getParticleCount();
                spawnParticles();
            }, 200);
        });
        
        let mouse = { x: null, y: null };
        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        
        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });
        
        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 110) {
                        const opacity = (1 - (dist / 110)) * 0.05;
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
                
                if (mouse.x !== null && mouse.y !== null) {
                    const mdx = particles[i].x - mouse.x;
                    const mdy = particles[i].y - mouse.y;
                    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                    
                    if (mdist < 130) {
                        const mopacity = (1 - (mdist / 130)) * 0.08;
                        ctx.strokeStyle = particles[i].color.replace(/[\d\.]+\)$/, `${mopacity})`);
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    };
    
    initBackgroundParticles();

    // --- 7. Hydrate DSA Stats & Generate Submission Heatmap ---
    const initDsaSystem = () => {
        // Hydrate terminal card metrics
        const problemsElem = document.getElementById('dsaProblemsSolved');
        const platformElem = document.getElementById('dsaPlatform');
        const languageElem = document.getElementById('dsaLanguage');
        const streakElem = document.getElementById('dsaCurrentStreak');
        const focusElem = document.getElementById('dsaFocusArea');

        if (problemsElem) problemsElem.textContent = DSA_STATS_CONFIG.problemsSolved;
        if (platformElem) platformElem.textContent = DSA_STATS_CONFIG.primaryPlatform;
        if (languageElem) languageElem.textContent = DSA_STATS_CONFIG.language;
        if (streakElem) streakElem.textContent = DSA_STATS_CONFIG.currentStreak;
        if (focusElem) focusElem.textContent = DSA_STATS_CONFIG.focusArea;

        // Generate client-side activity heatmap (16 weeks x 7 days)
        const heatmap = document.getElementById('dsaHeatmap');
        if (!heatmap) return;

        heatmap.innerHTML = '';
        const totalWeeks = 16;
        const totalDays = totalWeeks * 7;
        
        // Realistic pseudo-activity distribution
        for (let i = 0; i < totalDays; i++) {
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            
            // Weight recent weeks higher for visual engagement
            const recencyFactor = i / totalDays;
            const rand = Math.random();
            let level = 0;
            
            if (rand < 0.25 - (recencyFactor * 0.1)) {
                level = 0;
            } else if (rand < 0.55) {
                level = 1;
            } else if (rand < 0.8) {
                level = 2;
            } else if (rand < 0.93) {
                level = 3;
            } else {
                level = 4;
            }

            cell.classList.add(`lvl-${level}`);
            const submissions = level === 0 ? 0 : level === 1 ? '1-2' : level === 2 ? '3-4' : level === 3 ? '5-7' : '8+';
            cell.setAttribute('title', `${submissions} submissions on day ${i + 1}`);
            heatmap.appendChild(cell);
        }
    };

    initDsaSystem();

    // --- 8. Scroll-Triggered Transitions (Intersection Observer) ---
    const initScrollTransitions = () => {
        const scrollElements = document.querySelectorAll('.scroll-fade-in, .scroll-slide-right');
        
        const scrollObserverOptions = {
            root: null,
            rootMargin: '0px 0px -8% 0px',
            threshold: 0.1
        };
        
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, scrollObserverOptions);
        
        scrollElements.forEach(elem => {
            scrollObserver.observe(elem);
        });
    };
    
    initScrollTransitions();

    // --- 9. Back-to-Top Button ---
    const initBackToTop = () => {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 350) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    initBackToTop();

    // --- 10. Contact Form Validation & Submission ---
    const initContactForm = () => {
        const form = document.getElementById('contactForm');
        const nameInput = document.getElementById('formName');
        const emailInput = document.getElementById('formEmail');
        const messageInput = document.getElementById('formMessage');
        const nameError = document.getElementById('formNameError');
        const emailError = document.getElementById('formEmailError');
        const messageError = document.getElementById('formMessageError');
        const submitBtn = document.getElementById('btnSubmitForm');
        const toast = document.getElementById('toastNotification');

        if (!form) return;

        // Initialize EmailJS if available and valid key supplied
        const hasValidEmailJsKey = EMAIL_CONFIG.emailjs.publicKey && 
            EMAIL_CONFIG.emailjs.publicKey !== 'YOUR_PUBLIC_KEY';
            
        if (typeof emailjs !== 'undefined' && hasValidEmailJsKey) {
            emailjs.init(EMAIL_CONFIG.emailjs.publicKey);
        }

        const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

        const setError = (group, errorElem, message) => {
            group.classList.add('has-error');
            errorElem.textContent = message;
            errorElem.classList.add('visible');
        };

        const clearError = (group, errorElem) => {
            group.classList.remove('has-error');
            errorElem.textContent = '';
            errorElem.classList.remove('visible');
        };

        [nameInput, emailInput, messageInput].forEach((input, i) => {
            const errorElem = [nameError, emailError, messageError][i];
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    clearError(input.closest('.form-group'), errorElem);
                }
            });
        });

        const validateForm = () => {
            let isValid = true;

            // Name
            if (!nameInput.value.trim()) {
                setError(nameInput.closest('.form-group'), nameError, '↳ Please enter your name');
                isValid = false;
            } else {
                clearError(nameInput.closest('.form-group'), nameError);
            }

            // Email
            if (!emailInput.value.trim()) {
                setError(emailInput.closest('.form-group'), emailError, '↳ Please enter your email address');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value.trim())) {
                setError(emailInput.closest('.form-group'), emailError, '↳ Please enter a valid email address');
                isValid = false;
            } else {
                clearError(emailInput.closest('.form-group'), emailError);
            }

            // Message
            if (!messageInput.value.trim()) {
                setError(messageInput.closest('.form-group'), messageError, '↳ Please enter your message');
                isValid = false;
            } else if (messageInput.value.trim().length < 10) {
                setError(messageInput.closest('.form-group'), messageError, '↳ Message should be at least 10 characters');
                isValid = false;
            } else {
                clearError(messageInput.closest('.form-group'), messageError);
            }

            return isValid;
        };

        const triggerRipple = (e) => {
            const ripple = submitBtn.querySelector('.ripple-effect');
            if (!ripple) return;

            const rect = submitBtn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.remove('active');
            void ripple.offsetWidth;
            ripple.classList.add('active');
        };

        const showToast = (message, isError = false) => {
            if (!toast) return;
            const icon = toast.querySelector('.toast-icon');
            const msg = toast.querySelector('.toast-message');
            
            if (icon) icon.textContent = isError ? '✕' : '✓';
            if (msg) msg.textContent = message;
            
            if (isError) {
                toast.style.borderColor = '#ff5f56';
                if (icon) icon.style.background = '#ff5f56';
            } else {
                toast.style.borderColor = 'var(--accent-lime)';
                if (icon) icon.style.background = 'var(--accent-lime)';
            }
            
            toast.classList.add('visible');
            setTimeout(() => {
                toast.classList.remove('visible');
            }, 4500);
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            triggerRipple(e);

            if (!validateForm()) return;

            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `Sending... <span class="btn-arrow" style="display:inline-block; animation: pulse-dot 1s infinite;">⟳</span>`;

            const formData = {
                user_name: nameInput.value.trim(),
                user_email: emailInput.value.trim(),
                message: messageInput.value.trim(),
                from_name: nameInput.value.trim(),
                from_email: emailInput.value.trim()
            };

            try {
                // If Formspree endpoint is configured
                if (EMAIL_CONFIG.formspreeEndpoint) {
                    const response = await fetch(EMAIL_CONFIG.formspreeEndpoint, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });

                    if (response.ok) {
                        form.reset();
                        showToast("Message sent! I'll get back to you soon.");
                    } else {
                        throw new Error('Formspree responded with error');
                    }
                } 
                // Or if EmailJS is configured
                else if (typeof emailjs !== 'undefined' && hasValidEmailJsKey) {
                    await emailjs.send(
                        EMAIL_CONFIG.emailjs.serviceId,
                        EMAIL_CONFIG.emailjs.templateId,
                        formData
                    );
                    form.reset();
                    showToast("Message sent! I'll get back to you soon.");
                } 
                // Demo / fallback mode (when no backend keys configured yet)
                else {
                    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate async network
                    form.reset();
                    showToast("Message received! (Demo mode: Connect EmailJS/Formspree for live delivery)");
                }
            } catch (err) {
                console.error('Contact Form Error:', err);
                showToast("Failed to send message. Please email me directly at anvarshaanvar576@gmail.com", true);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            }
        });
    };

    initContactForm();

    // Console System Sign-off
    console.log('%cANVARSHA. // SYSTEM READY', 'color: #00d4ff; font-family: monospace; font-size: 14px; font-weight: bold;');
    console.log('%cFull-Stack Developer | Pathanamthitta, Kerala', 'color: #b8ff57; font-family: monospace; font-size: 11px;');
});
