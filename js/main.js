// Account login widget + cart sync (site-wide). No-ops if Supabase keys unset.
import { supabase } from './supabase.js';
import './auth.js';
import './cart-sync.js';
import './checkout.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. STICKY NAV AND SCROLL EFFECT
  const navbar = document.getElementById('main-navbar');
  const navLinks = navbar ? navbar.querySelectorAll('.nav-link') : [];
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  let isNavbarHovered = false;

  const updateNavbarState = () => {
    if (!navbar) return;
    const isScrolled = window.scrollY > 20;
    const shouldBeWhite = isScrolled || isNavbarHovered;

    const logoText = document.getElementById('nav-logo-text');

    if (shouldBeWhite) {
      // White bar state
      navbar.className = "fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-md h-20";
      
      if (logoText) {
        logoText.classList.remove("text-white"); logoText.classList.add("text-gray-900");
      }

      // Update link colors
      navLinks.forEach(link => {
        if (link.classList.contains('active')) {
          link.className = "nav-link active text-pci-blue text-sm font-semibold transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-pci-blue";
        } else {
          link.className = "nav-link text-gray-600 text-sm font-medium transition-colors hover:text-pci-blue";
        }
      });

      // Update hamburger button
      if (mobileMenuBtn) {
        mobileMenuBtn.className = "text-gray-600 hover:text-pci-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-bright p-2 rounded-lg hover:bg-gray-100";
      }
    } else {
      // Dark transparent state (matches attached image)
      navbar.className = "fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-black/15 backdrop-blur-md border-b border-white/10 h-20";
      
      if (logoText) {
        logoText.classList.remove("text-gray-900"); logoText.classList.add("text-white");
      }

      // Update link colors
      navLinks.forEach(link => {
        if (link.classList.contains('active')) {
          link.className = "nav-link active text-white text-sm font-semibold transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-white";
        } else {
          link.className = "nav-link text-white/85 text-sm font-medium transition-colors hover:text-white";
        }
      });

      // Update hamburger button
      if (mobileMenuBtn) {
        mobileMenuBtn.className = "text-white hover:text-teal-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-bright p-2 rounded-lg hover:bg-white/10";
      }
    }
  };

  if (navbar) {
    window.addEventListener('scroll', updateNavbarState);
    
    // Mouse hover events
    navbar.addEventListener('mouseenter', () => {
      isNavbarHovered = true;
      updateNavbarState();
    });
    
    navbar.addEventListener('mouseleave', () => {
      isNavbarHovered = false;
      updateNavbarState();
    });

    updateNavbarState(); // Run initially
  }

  // 2. MOBILE MENU HAMBURGER MODAL
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      if (isOpen) {
        mobileMenu.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      } else {
        mobileMenu.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
      mobileMenuBtn.setAttribute('aria-expanded', String(!isOpen));
      mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
    });

    // Close menu when clicking nav link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  // 3. SCROLL REVEAL ENGINE
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 4. STATS COUNT-UP ANIMATION
  const statNumbers = document.querySelectorAll('.counter');
  if (statNumbers.length > 0) {
    const countUp = (element) => {
      const target = parseFloat(element.getAttribute('data-target'));
      const duration = 2000; // ms
      const countSpeed = target / (duration / 16); // 60 FPS
      let current = 0;

      const updateCount = () => {
        current += countSpeed;
        if (current >= target) {
          element.textContent = element.getAttribute('data-prefix') + target + element.getAttribute('data-suffix');
        } else {
          // Format based on integer or float
          if (Number.isInteger(target)) {
            element.textContent = element.getAttribute('data-prefix') + Math.floor(current) + element.getAttribute('data-suffix');
          } else {
            element.textContent = element.getAttribute('data-prefix') + current.toFixed(1) + element.getAttribute('data-suffix');
          }
          requestAnimationFrame(updateCount);
        }
      };
      requestAnimationFrame(updateCount);
    };

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            statNumbers.forEach(num => countUp(num));
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      statsObserver.observe(statsSection);
    }
  }

  // 5. PRODUCT CATALOG FILTERING
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (filterBtns.length > 0 && productCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active class on buttons
        filterBtns.forEach(b => b.classList.remove('active', 'bg-pci-blue', 'text-white'));
        filterBtns.forEach(b => b.classList.add('bg-white', 'text-gray-600'));
        btn.classList.add('active', 'bg-pci-blue', 'text-white');
        btn.classList.remove('bg-white', 'text-gray-600');

        const filter = btn.getAttribute('data-filter').toLowerCase();

        productCards.forEach(card => {
          const tags = card.getAttribute('data-tags').toLowerCase().split(' ');
          if (filter === 'all' || tags.includes(filter)) {
            card.classList.remove('hidden');
            // Re-apply transitions
            card.style.opacity = '0';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              card.classList.add('hidden');
            }, 200);
          }
        });
      });
    });

    // Product Learn More expand functionality
    const expandLinks = document.querySelectorAll('.expand-link');
    expandLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const cardId = link.getAttribute('data-card-id');
        const detailPanel = document.getElementById(`details-${cardId}`);
        const expandText = link.querySelector('.expand-text');
        
        if (detailPanel) {
          if (detailPanel.classList.contains('hidden')) {
            detailPanel.classList.remove('hidden');
            detailPanel.style.maxHeight = '0px';
            detailPanel.style.opacity = '0';
            setTimeout(() => {
              detailPanel.style.maxHeight = '200px';
              detailPanel.style.opacity = '1';
            }, 10);
            if (expandText) expandText.textContent = 'Collapse Details';
          } else {
            detailPanel.style.maxHeight = '0px';
            detailPanel.style.opacity = '0';
            setTimeout(() => {
              detailPanel.classList.add('hidden');
            }, 300);
            if (expandText) expandText.textContent = 'Learn More';
          }
        }
      });
    });
  }

  // 6. CONTACT FORM
  // The contact form saves to the Supabase `inquiries` table (insert-only RLS).
  const saveInquiry = async (row) => {
    if (!supabase) throw new Error('no backend');
    const { error } = await supabase.from('inquiries').insert(row);
    if (error) throw error;
  };

  const contactForm = document.getElementById('contact-us-form');
  if (contactForm) {
    const status = document.getElementById('cf-status');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(contactForm);
      if (fd.get('website')) return;
      submitBtn.disabled = true;
      const label = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      try {
        await saveInquiry({
          kind: 'contact',
          name: fd.get('name'),
          organization: fd.get('organization'),
          email: fd.get('email'),
          subject: fd.get('subject'),
          message: fd.get('message'),
          page: window.location.pathname,
        });
        const box = document.createElement('div');
        box.className = 'bg-white p-8 rounded-2xl border border-gray-100 shadow-md text-center animate-fade-in';
        box.innerHTML = `
          <div class="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="h-8 w-8 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Message received</h3>
          <p class="text-gray-600 mb-6 max-w-sm mx-auto">Thanks for contacting Precision Cellular Immunology. Our team will reply to <b class="cf-echo"></b> within one business day.</p>
          <a href="index.html" class="inline-flex items-center justify-center bg-pci-blue hover:bg-pci-blue-hover text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-200">Return Home</a>`;
        box.querySelector('.cf-echo').textContent = fd.get('email');
        contactForm.replaceWith(box);
        if (status) status.hidden = true;
      } catch {
        submitBtn.disabled = false;
        submitBtn.textContent = label;
        if (status) {
          status.hidden = false;
          status.className = 'text-sm mt-3 text-rose-600';
          status.innerHTML = 'We couldn\u2019t send your message. Please email <a class="underline" href="mailto:support@pcibio.com">support@pcibio.com</a> instead.';
        }
      }
    });
  }

});
