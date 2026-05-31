/* ==========================================
   SAMHITHA DESIGNER BOUTIQUE - INTERACTIVE LOGIC
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. STICKY HEADER SCROLL EFFECT ---
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    // --- 2. MOBILE NAVIGATION MENU ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Toggle menu
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileNavMenu.classList.toggle('open');
        mobileMenuBtn.classList.toggle('active');
        
        // Toggle hamburger animation
        const bars = mobileMenuBtn.querySelectorAll('.bar');
        if (mobileNavMenu.classList.contains('open')) {
            bars[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close menu when clicking links
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileNavMenu.classList.contains('open') && !mobileNavMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });

    function closeMobileMenu() {
        mobileNavMenu.classList.remove('open');
        const bars = mobileMenuBtn.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }


    // --- 3. SCROLL REVEAL ANIMATIONS (Intersection Observer) ---
    const revealSections = document.querySelectorAll('.scroll-reveal');
    
    const isMobileViewport = window.innerWidth <= 768;
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: isMobileViewport ? 0.02 : 0.15,
        rootMargin: isMobileViewport ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
    });

    revealSections.forEach(section => {
        revealObserver.observe(section);
    });


    // --- 4. NAVIGATION ACTIVE SECTION TRACKER ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function checkActiveSection() {
        let scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            if (scrollPosition >= section.offsetTop && scrollPosition < (section.offsetTop + section.offsetHeight)) {
                const currentId = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', checkActiveSection);


    // --- 5. GALLERY MASONRY FILTERING ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const itemCategories = item.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || itemCategories.includes(filterValue)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });


    // --- 6. LIGHTBOX MODAL GALLERY (With Nav Loop) ---
    const lightbox = document.getElementById('custom-lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close-btn');
    const prevBtn = document.getElementById('lightbox-prev-btn');
    const nextBtn = document.getElementById('lightbox-next-btn');

    let currentItemIndex = 0;
    let visibleGalleryItems = [];

    // Open lightbox
    galleryItems.forEach((item, index) => {
        const zoomBtn = item.querySelector('.zoom-btn');
        
        // Handle click on item overlay or zoom button
        item.addEventListener('click', (e) => {
            // Make sure we only capture visible items for slideshow cycling
            visibleGalleryItems = Array.from(galleryItems).filter(el => !el.classList.contains('hidden'));
            currentItemIndex = visibleGalleryItems.indexOf(item);
            
            if (currentItemIndex > -1) {
                openLightbox(visibleGalleryItems[currentItemIndex]);
            }
        });
    });

    function openLightbox(itemElement) {
        const img = itemElement.querySelector('.gallery-img');
        const title = itemElement.querySelector('.item-title').textContent;
        const category = itemElement.querySelector('.item-category').textContent;

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.innerHTML = `<span class="gold-text">${category}</span> &bull; ${title}`;
        
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Stop page scroll behind modal
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Re-enable page scroll
    }

    function showNext() {
        if (visibleGalleryItems.length === 0) return;
        currentItemIndex = (currentItemIndex + 1) % visibleGalleryItems.length;
        openLightbox(visibleGalleryItems[currentItemIndex]);
    }

    function showPrev() {
        if (visibleGalleryItems.length === 0) return;
        currentItemIndex = (currentItemIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length;
        openLightbox(visibleGalleryItems[currentItemIndex]);
    }

    // Lightbox triggers
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    
    // Close on overlay click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-content')) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNext();
        } else if (e.key === 'ArrowLeft') {
            showPrev();
        }
    });


    // --- 7. APPOINTMENT BOOKING FORM & WHATSAPP REDIRECT ---
    const inquiryForm = document.getElementById('inquiry-form-element');

    inquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Retrieve values
        const name = document.getElementById('form-name').value.trim();
        const phone = document.getElementById('form-phone').value.trim();
        const service = document.getElementById('form-service').value;
        const eventDate = document.getElementById('form-date').value;
        const message = document.getElementById('form-message').value.trim();

        // Form Validation
        if (!name || !phone || !service) {
            alert('Please fill out all required fields marked with *');
            return;
        }

        // WhatsApp Custom Message Template
        let waText = `*SAMHITHA DESIGNER BOUTIQUE - DESIGN CONSULTATION*\n\n`;
        waText += `Deargowithami Garu,\n`;
        waText += `I would like to enquire / book a design consultation for my outfit. Below are my details:\n\n`;
        waText += `*Name:* ${name}\n`;
        waText += `*Phone:* ${phone}\n`;
        waText += `*Required Service:* ${service}\n`;
        
        if (eventDate) {
            // Format date to local readable format
            const formattedDate = new Date(eventDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            waText += `*Estimated Event Date:* ${formattedDate}\n`;
        }
        
        if (message) {
            waText += `\n*Custom Requirements:*\n${message}\n`;
        }

        // URL encode the text message
        const encodedText = encodeURIComponent(waText);
        
        // Target phone: +91 63028 77252
        const targetNumber = '916302877252';
        const waUrl = `https://wa.me/${targetNumber}?text=${encodedText}`;

        // Redirect user to WhatsApp API
        window.open(waUrl, '_blank');
        
        // Reset form
        inquiryForm.reset();
    });


    // --- 8. SCROLL TO TOP & FLOATING ACTIONS CONTROL ---
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    const floatingCtas = document.querySelector('.floating-ctas');

    window.addEventListener('scroll', () => {
        // Show scroll-to-top and floating contact widgets after scrolling past 300px (outside the hero)
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('active');
            if (floatingCtas) floatingCtas.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
            if (floatingCtas) floatingCtas.classList.remove('active');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});
