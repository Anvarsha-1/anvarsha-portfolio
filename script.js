/* ==========================================================================
   ANVARSHA. PORTFOLIO INTERACTION SYSTEM
   Pure Vanilla JS with requestAnimationFrame Damping and Modern Observers
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {


    // --- 1a. Page Loader ---
    const loader = document.getElementById('pageLoader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('loaded');
            document.body.classList.add('page-loaded');
            
            // Trigger hero animations when loader finishes
            const heroElements = document.querySelectorAll('.fade-in-up');
            heroElements.forEach(el => {
                el.style.animation = 'fadeInUp 0.8s var(--ease-editorial) forwards';
            });
            
            // Remove loader from DOM after fade-out transition
            setTimeout(() => {
                if (loader && loader.parentElement) loader.remove();
            }, 800);
        }, 1200);
    } else {
        // No loader element — trigger hero animations immediately
        document.body.classList.add('page-loaded');
        const heroElements = document.querySelectorAll('.fade-in-up');
        heroElements.forEach(el => {
            el.style.animation = 'fadeInUp 0.8s var(--ease-editorial) forwards';
        });
    }

    // --- 2. Auto-Hiding Navbar Scroll Event ---
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Hide only when scrolled down significantly (past navbar height)
        if (currentScrollY > 80) {
            if (currentScrollY > lastScrollY) {
                // Scrolling down -> hide navbar
                navbar.classList.add('nav-hidden');
            } else {
                // Scrolling up -> show navbar
                navbar.classList.remove('nav-hidden');
            }
        } else {
            // At the top of the page -> always show navbar
            navbar.classList.remove('nav-hidden');
        }
        
        lastScrollY = currentScrollY;
    });

    // --- 3. Mobile Navigation Menu Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const individualLinks = document.querySelectorAll('.nav-item');

    const toggleMenu = () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        // Prevent body scrolling when mobile menu is open
        document.body.classList.toggle('no-scroll');
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking individual mobile links
    individualLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            // Close menu with animation
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
            
            // Navigate to section after menu closes
            setTimeout(() => {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300);
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar-container') && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });

    // --- 4. Scroll-Spy (Highlight Active Nav Link) ---
    // Uses modern performant IntersectionObserver
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');

    const observerOptions = {
        root: null, // Viewport
        rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the active middle portion
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
        
        const words = ["Full-Stack Developer", "MERN Stack Builder", "Problem Solver"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        const type = () => {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                target.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50; // speed up when deleting
            } else {
                target.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 150; // normal typing speed
            }
            
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typingSpeed = 2000; // pause on full word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 500; // pause before starting next word
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
        
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;
        
        const particles = [];
        // Determine count based on canvas area
        const getParticleCount = () => {
            return Math.min(50, Math.floor((width * height) / 18000));
        };
        let particleCount = getParticleCount();
        
        const colors = [
            'rgba(0, 212, 255, 0.12)', // cyan
            'rgba(184, 255, 87, 0.08)'  // lime
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
                
                // Wrap boundaries
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
        
        // Initialize particle array
        const spawnParticles = () => {
            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };
        
        spawnParticles();
        
        // Resize handling
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
        
        // Interactive mouse connection option:
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
                
                // Draw links between nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 110) {
                        // Calculate opacity based on distance
                        const opacity = (1 - (dist / 110)) * 0.05;
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
                
                // Draw links between mouse and nearby particles
                if (mouse.x !== null && mouse.y !== null) {
                    const mdx = particles[i].x - mouse.x;
                    const mdy = particles[i].y - mouse.y;
                    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                    
                    if (mdist < 140) {
                        const mopacity = (1 - (mdist / 140)) * 0.08;
                        // blend between cyan/lime based on particle color
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


    // --- 7. Scroll-Triggered Transitions (Intersection Observer) ---
    const initScrollTransitions = () => {
        const scrollElements = document.querySelectorAll('.scroll-fade-in, .scroll-slide-right');
        const progressFills = document.querySelectorAll('.progress-fill');
        
        const scrollObserverOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px', // Trigger slightly before the element fully enters
            threshold: 0.1
        };
        
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target); // Animates once
                }
            });
        }, scrollObserverOptions);
        
        scrollElements.forEach(elem => {
            scrollObserver.observe(elem);
        });

        // Trigger progress bars width fill animation
        const progressObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetWidth = entry.target.getAttribute('data-target-width');
                    entry.target.style.width = targetWidth;
                    observer.unobserve(entry.target); // Trigger once
                }
            });
        }, { root: null, threshold: 0.1 });

        progressFills.forEach(fill => {
            progressObserver.observe(fill);
        });
    };
    
    initScrollTransitions();

    // --- 8. Back-to-Top Button ---
    const initBackToTop = () => {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;

        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // Smooth scroll to top on click
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    initBackToTop();

    // --- 9. Contact Form Validation, Ripple & EmailJS ---
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

        // ============================================================
        // TODO: Replace these with your actual EmailJS credentials
        // 1. Sign up at https://www.emailjs.com/
        // 2. Create an Email Service (connect your Gmail)
        // 3. Create an Email Template with variables: {{from_name}}, {{from_email}}, {{message}}
        // 4. Copy your Public Key, Service ID, and Template ID below
        // ============================================================
        const EMAILJS_PUBLIC_KEY = "0tlpurJ3jEg3FPcbr";   // e.g. 'aBcDeFgHiJkLmNoP'
        const EMAILJS_SERVICE_ID = "service_vtkr2cn";    // e.g. 'service_xxxxxxx'
        const EMAILJS_TEMPLATE_ID = "template_879uhv8";  // e.g. 'template_xxxxxxx'

        // Initialize EmailJS with your public key
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_PUBLIC_KEY);
        }

        // Email regex pattern (RFC-aligned)
        const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

        // Helper — set error state on a field
        const setError = (group, errorElem, message) => {
            group.classList.add('has-error');
            errorElem.textContent = message;
            errorElem.classList.add('visible');
        };

        // Helper — clear error state on a field
        const clearError = (group, errorElem) => {
            group.classList.remove('has-error');
            errorElem.textContent = '';
            errorElem.classList.remove('visible');
        };

        // Live clear on input
        [nameInput, emailInput, messageInput].forEach((input, i) => {
            const errorElem = [nameError, emailError, messageError][i];
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    clearError(input.closest('.form-group'), errorElem);
                }
            });
        });

        // Validate all fields — returns true if valid
        const validateForm = () => {
            let isValid = true;

            // Name validation
            if (!nameInput.value.trim()) {
                setError(nameInput.closest('.form-group'), nameError, '↳ Name is required');
                isValid = false;
            } else {
                clearError(nameInput.closest('.form-group'), nameError);
            }

            // Email validation
            if (!emailInput.value.trim()) {
                setError(emailInput.closest('.form-group'), emailError, '↳ Email is required');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value.trim())) {
                setError(emailInput.closest('.form-group'), emailError, '↳ Please enter a valid email address');
                isValid = false;
            } else {
                clearError(emailInput.closest('.form-group'), emailError);
            }

            // Message validation
            if (!messageInput.value.trim()) {
                setError(messageInput.closest('.form-group'), messageError, '↳ Message is required');
                isValid = false;
            } else {
                clearError(messageInput.closest('.form-group'), messageError);
            }

            return isValid;
        };

        // Ripple animation on button click
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

            // Reset animation
            ripple.classList.remove('active');
            // Force reflow to restart animation
            void ripple.offsetWidth;
            ripple.classList.add('active');
        };

        // Show toast notification
        const showToast = () => {
            if (!toast) return;
            toast.classList.add('visible');
            setTimeout(() => {
                toast.classList.remove('visible');
            }, 4000);
        };

        // Form submission handler
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Trigger ripple
            triggerRipple(e);

            if (!validateForm()) return;

            // Disable button while sending
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `Sending... <span class="btn-arrow">⟳</span>`;

            // Prepare template parameters (match your EmailJS template variables)
            const templateParams = {
                from_name: nameInput.value.trim(),
                from_email: emailInput.value.trim(),
                message: messageInput.value.trim()
            };

            try {
                // Send via EmailJS
                if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
                    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
                }

                // Success — reset form and show toast
                form.reset();
                showToast();
            } catch (error) {
                console.error('EmailJS Error:', error);
                // Still show success toast for demo / when keys aren't set
                if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
                    form.reset();
                    showToast();
                } else {
                    // Real error — notify user
                    const errorToastMsg = toast.querySelector('.toast-message');
                    const errorToastIcon = toast.querySelector('.toast-icon');
                    if (errorToastMsg) errorToastMsg.textContent = 'Failed to send. Please try again or email directly.';
                    if (errorToastIcon) errorToastIcon.textContent = '✕';
                    toast.style.borderColor = '#ff5f56';
                    toast.classList.add('visible');
                    setTimeout(() => {
                        toast.classList.remove('visible');
                        // Reset toast to default state
                        setTimeout(() => {
                            if (errorToastMsg) errorToastMsg.textContent = "Message sent! I'll get back to you soon.";
                            if (errorToastIcon) errorToastIcon.textContent = '✓';
                            toast.style.borderColor = '';
                        }, 500);
                    }, 4000);
                }
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    };

    initContactForm();

    // --- 10. Interactive Polish & Log Sign-Off ---
    console.log('%cANVARSHA. // SYSTEM READY', 'color: #00d4ff; font-family: monospace; font-size: 14px; font-weight: bold;');
    console.log('%cFull-Stack Developer | Pathanamthitta, Kerala', 'color: #b8ff57; font-family: monospace; font-size: 11px;');
});
