/* ==========================================================================
   ANVARSHA. PORTFOLIO INTERACTION SYSTEM
   Pure Vanilla JS with requestAnimationFrame Damping and Modern Observers
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {


    // --- 1b. Page Loader ---
    const loader = document.getElementById('pageLoader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('loaded');
            document.body.classList.add('page-loaded');
            // Remove loader from DOM after fade-out transition
            setTimeout(() => loader.remove(), 600);
        }, 1200);
    } else {
        // No loader element — trigger hero animations immediately
        document.body.classList.add('page-loaded');
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
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
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

    // --- 6b. Morphing Low-Poly Orb Animation ---
    const initSkillOrb = () => {
        const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        const canvas = document.getElementById('skillOrb');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        let W = 0, H = 0;
        let CX = 0, CY = 0;
        let baseRadius = 140;
        
        let time = 0;
        let rotX = 0.4;
        let rotY = 0.4;
        let rotXVelocity = 0;
        let rotYVelocity = 0;
        let shockwave = 0;
        
        const mouse = { x: null, y: null, active: false };

        // 1. buildIcosphere(subdivisions) — returns { verts, faces }
        function buildIcosphere(subdivisions) {
            const t = (1 + Math.sqrt(5)) / 2;
            
            // 12 base vertices of icosahedron
            let baseVerts = [
                [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
                [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
                [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
            ];
            
            // Normalize base vertices
            const len = Math.sqrt(1 + t * t);
            let verts = baseVerts.map(v => [v[0] / len, v[1] / len, v[2] / len]);
            
            // 20 base faces
            let faces = [
                [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
                [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
                [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
                [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
            ];
            
            // Helper function to subdivide
            function subdivide(vertsList, facesList) {
                const newFaces = [];
                const midpointCache = {};
                
                function getMidpoint(a, b) {
                    const key = a < b ? `${a}_${b}` : `${b}_${a}`;
                    if (midpointCache[key] !== undefined) {
                        return midpointCache[key];
                    }
                    const v1 = vertsList[a];
                    const v2 = vertsList[b];
                    const mx = (v1[0] + v2[0]) / 2;
                    const my = (v1[1] + v2[1]) / 2;
                    const mz = (v1[2] + v2[2]) / 2;
                    
                    const mLen = Math.sqrt(mx * mx + my * my + mz * mz);
                    const newVert = [mx / mLen, my / mLen, mz / mLen];
                    vertsList.push(newVert);
                    const idx = vertsList.length - 1;
                    midpointCache[key] = idx;
                    return idx;
                }
                
                for (let i = 0; i < facesList.length; i++) {
                    const a = facesList[i][0];
                    const b = facesList[i][1];
                    const c = facesList[i][2];
                    
                    const ab = getMidpoint(a, b);
                    const bc = getMidpoint(b, c);
                    const ca = getMidpoint(c, a);
                    
                    newFaces.push([a, ab, ca]);
                    newFaces.push([b, bc, ab]);
                    newFaces.push([c, ca, bc]);
                    newFaces.push([ab, bc, ca]);
                }
                return newFaces;
            }
            
            for (let s = 0; s < subdivisions; s++) {
                faces = subdivide(verts, faces);
            }
            
            return { verts, faces };
        }
        
        const { verts, faces } = buildIcosphere(2);
        
        // 2. resize() — sets W, H, CX, CY, canvas dimensions with devicePixelRatio
        function resize() {
            const rect = canvas.getBoundingClientRect();
            W = rect.width;
            H = rect.height;
            CX = W / 2;
            CY = H / 2;
            
            if (window.innerWidth < 768) {
                baseRadius = 100;
            } else {
                baseRadius = 140;
            }
            
            const dpr = window.devicePixelRatio || 1;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            ctx.resetTransform();
            ctx.scale(dpr, dpr);
        }
        
        // 3. SkillNode per-vertex displacement data array (vertDisplace[])
        const vertDisplace = [];
        for (let i = 0; i < verts.length; i++) {
            vertDisplace.push({
                offset: Math.random() * Math.PI * 2,
                speed: 0.01 + Math.random() * 0.03,
                amp: 0.04 + Math.random() * 0.06
            });
        }
        
        // 4. getDisplacedVert(i) — applies breathing + shockwave to vertex i
        function getDisplacedVert(i) {
            const v = verts[i];
            let disp = 1.0;
            if (!isReduced) {
                const profile = vertDisplace[i];
                disp += Math.sin(time * profile.speed + profile.offset) * profile.amp;
                if (shockwave > 0.01) {
                    disp += shockwave * 0.18;
                }
            }
            return [v[0] * disp, v[1] * disp, v[2] * disp];
        }
        
        // 5. rotatePoint(v, rx, ry) — rotate Y then X, returns [x, y, z]
        function rotatePoint(v, rx, ry) {
            const x = v[0], y = v[1], z = v[2];
            // Rotate Y (ry)
            const cosY = Math.cos(ry);
            const sinY = Math.sin(ry);
            const x1 = x * cosY + z * sinY;
            const y1 = y;
            const z1 = -x * sinY + z * cosY;
            
            // Rotate X (rx)
            const cosX = Math.cos(rx);
            const sinX = Math.sin(rx);
            const x2 = x1;
            const y2 = y1 * cosX - z1 * sinX;
            const z2 = y1 * sinX + z1 * cosX;
            
            return [x2, y2, z2];
        }
        
        // 6. draw() — full frame render: clear → sort faces → cull → color → stroke → cursor
        function draw() {
            // Clear canvas background
            ctx.fillStyle = "#0a0a0f";
            ctx.fillRect(0, 0, W, H);
            
            // Get displaced and rotated vertices
            const rotatedVerts = [];
            for (let i = 0; i < verts.length; i++) {
                const dv = getDisplacedVert(i);
                rotatedVerts.push(rotatePoint(dv, rotX, rotY));
            }
            
            // Projected coordinates
            const projectedVerts = [];
            for (let i = 0; i < rotatedVerts.length; i++) {
                const rv = rotatedVerts[i];
                const scale = baseRadius * (1 + rv[2] * 0.18);
                projectedVerts.push([
                    CX + rv[0] * scale,
                    CY + rv[1] * scale
                ]);
            }
            
            // Sort faces by average Z depth
            const sortedFaceData = [];
            for (let f = 0; f < faces.length; f++) {
                const face = faces[f];
                const zAvg = (rotatedVerts[face[0]][2] + rotatedVerts[face[1]][2] + rotatedVerts[face[2]][2]) / 3;
                sortedFaceData.push({ index: f, z: zAvg });
            }
            sortedFaceData.sort((a, b) => a.z - b.z);
            
            // Render faces
            for (let i = 0; i < sortedFaceData.length; i++) {
                const faceIdx = sortedFaceData[i].index;
                const face = faces[faceIdx];
                
                const pA = projectedVerts[face[0]];
                const pB = projectedVerts[face[1]];
                const pC = projectedVerts[face[2]];
                
                // Backface culling: 2D cross product of projected edges
                const cross = (pB[0] - pA[0]) * (pC[1] - pA[1]) - (pB[1] - pA[1]) * (pC[0] - pA[0]);
                if (cross > 0) continue;
                
                // Calculate base color interpolation based on rotated Z depth
                // Front faces = cyan, side faces = lime blend
                const zAvg = sortedFaceData[i].z;
                const t = Math.max(0, Math.min(1, zAvg)); // Clamped to [0, 1] since culled faces are < 0
                
                // Interpolate RGB values: Lime (#b8ff57, 184, 255, 87) to Cyan (#00d4ff, 0, 212, 255)
                const rBase = 184 * (1 - t);
                const gBase = 255 * (1 - t) + 212 * t;
                const bBase = 87 * (1 - t) + 255 * t;
                
                // Centroid distance to cursor
                let bright = 0;
                if (mouse.active && mouse.x !== null && mouse.y !== null) {
                    const centroidX = (pA[0] + pB[0] + pC[0]) / 3;
                    const centroidY = (pA[1] + pB[1] + pC[1]) / 3;
                    const dx = centroidX - mouse.x;
                    const dy = centroidY - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const threshold = 0.55 * baseRadius;
                    
                    if (dist < threshold) {
                        bright = (1 - (dist / threshold)) * 0.40;
                    }
                }
                
                // Shockwave brightening
                const totalBright = Math.min(1.0, bright + shockwave * 0.25);
                
                // Interpolate toward white
                const rFinal = Math.round(rBase + (255 - rBase) * totalBright);
                const gFinal = Math.round(gBase + (255 - gBase) * totalBright);
                const bFinal = Math.round(bBase + (255 - bBase) * totalBright);
                
                ctx.fillStyle = `rgb(${rFinal}, ${gFinal}, ${bFinal})`;
                
                ctx.beginPath();
                ctx.moveTo(pA[0], pA[1]);
                ctx.lineTo(pB[0], pB[1]);
                ctx.lineTo(pC[0], pC[1]);
                ctx.closePath();
                ctx.fill();
                
                // Edge stroke
                ctx.strokeStyle = "rgba(0, 212, 255, 0.12)";
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
            
            // Custom cursor (inner filled dot, outer ring)
            if (mouse.active && mouse.x !== null && mouse.y !== null) {
                // Outer ring
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, 14, 0, Math.PI * 2);
                ctx.strokeStyle = "rgba(0, 212, 255, 0.2)";
                ctx.lineWidth = 0.7;
                ctx.stroke();
                
                // Inner dot
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(0, 212, 255, 0.9)";
                ctx.fill();
            }
        }
        
        // 7. tick() — update time, rotation spring, shockwave decay, call draw(), rAF
        function tick() {
            if (!isReduced) {
                time += 1;
                
                if (mouse.active && mouse.x !== null && mouse.y !== null) {
                    const targetRotY = ((mouse.x - CX) / CX) * 0.9;
                    const targetRotX = -((mouse.y - CY) / CY) * 0.9;
                    
                    rotYVelocity = rotYVelocity * 0.88 + (targetRotY - rotY) * 0.04;
                    rotY += rotYVelocity;
                    
                    rotXVelocity = rotXVelocity * 0.88 + (targetRotX - rotX) * 0.04;
                    rotX += rotXVelocity;
                } else {
                    rotY += 0.0012;
                    rotX += 0.0008;
                    rotYVelocity = 0;
                    rotXVelocity = 0;
                }
                
                shockwave *= 0.93;
            }
            
            draw();
            requestAnimationFrame(tick);
        }
        
        // 8. All event listeners
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.active = true;
        });
        
        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
            mouse.active = false;
        });
        
        canvas.addEventListener('click', () => {
            if (!isReduced) {
                shockwave = 1.0;
            }
        });
        
        canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                e.preventDefault();
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.touches[0].clientX - rect.left;
                mouse.y = e.touches[0].clientY - rect.top;
                mouse.active = true;
            }
        }, { passive: false });
        
        canvas.addEventListener('touchend', (e) => {
            mouse.x = null;
            mouse.y = null;
            mouse.active = false;
            if (!isReduced) {
                shockwave = 1.0;
            }
        });
        
        window.addEventListener('resize', resize);
        
        // Initial setup
        resize();
        tick();
    };

    initSkillOrb();

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
        const EMAILJS_PUBLIC_KEY = "Z0CUewLvEi8J7LtpL";   // e.g. 'aBcDeFgHiJkLmNoP'
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
