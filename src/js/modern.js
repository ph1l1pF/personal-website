// Modern Personal Website JavaScript

(function() {
   'use strict';

   // Mobile Menu Toggle
   const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
   const navMenu = document.querySelector('.nav-menu');
   const navLinks = document.querySelectorAll('.nav-link');

   if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', function() {
         mobileMenuBtn.classList.toggle('active');
         navMenu.classList.toggle('active');
         document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
      });
   }

   // Close mobile menu when clicking on a link
   navLinks.forEach(link => {
      link.addEventListener('click', function() {
         if (navMenu.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
         }
      });
   });

   // Navbar scroll effect
   const navbar = document.getElementById('navbar');
   let lastScroll = 0;

   window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      // Add/remove scrolled class
      if (currentScroll > 100) {
         navbar.classList.add('scrolled');
      } else {
         navbar.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
   });

   // Active navigation link based on scroll position
   window.addEventListener('scroll', function() {
      let current = '';
      const sections = document.querySelectorAll('section[id]');

      sections.forEach(section => {
         const sectionTop = section.offsetTop;
         const sectionHeight = section.clientHeight;
         if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
         }
      });

      navLinks.forEach(link => {
         link.classList.remove('active');
         if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
         }
      });
   });

   // Smooth scroll for anchor links (Safari compatible)
   document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
         const href = this.getAttribute('href');
         
         // Skip if it's just '#'
         if (href === '#') {
            e.preventDefault();
            return;
         }

         const target = document.querySelector(href);
         if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            
            // Safari-compatible smooth scrolling
            if ('scrollBehavior' in document.documentElement.style) {
               window.scrollTo({
                  top: offsetTop,
                  behavior: 'smooth'
               });
            } else {
               // Fallback for Safari
               smoothScrollTo(offsetTop);
            }
         }
      });
   });

   // Safari-compatible smooth scroll function
   function smoothScrollTo(targetPosition) {
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 800;
      let start = null;

      function animation(currentTime) {
         if (start === null) start = currentTime;
         const timeElapsed = currentTime - start;
         const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
         window.scrollTo(0, run);
         if (timeElapsed < duration) requestAnimationFrame(animation);
      }

      function easeInOutQuad(t, b, c, d) {
         t /= d / 2;
         if (t < 1) return c / 2 * t * t + b;
         t--;
         return -c / 2 * (t * (t - 2) - 1) + b;
      }

      requestAnimationFrame(animation);
   }

   // Scroll to top button
   const scrollTopBtn = document.getElementById('scroll-top');

   if (scrollTopBtn) {
      window.addEventListener('scroll', function() {
         if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
         } else {
            scrollTopBtn.classList.remove('visible');
         }
      });

      scrollTopBtn.addEventListener('click', function() {
         // Safari-compatible smooth scrolling
         if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
               top: 0,
               behavior: 'smooth'
            });
         } else {
            // Fallback for Safari
            smoothScrollTo(0);
         }
      });
   }

   // Intersection Observer for fade-in animations
   const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
   };

   const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
         if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
         }
      });
   }, observerOptions);

   // Observe elements for animation
   const animateElements = document.querySelectorAll('.timeline-item, .contact-card, .about-content');
   animateElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
   });

   // Add loading state removal
   window.addEventListener('load', function() {
      document.body.classList.add('loaded');
   });

   // Prevent body scroll when mobile menu is open
   let scrollPosition = 0;

   function lockScroll() {
      scrollPosition = window.pageYOffset;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = '100%';
   }

   function unlockScroll() {
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('top');
      document.body.style.removeProperty('width');
      window.scrollTo(0, scrollPosition);
   }

   // Update mobile menu toggle to use scroll lock
   if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', function() {
         const isActive = navMenu.classList.contains('active');
         if (isActive) {
            unlockScroll();
         } else {
            lockScroll();
         }
      });
   }

   // Close mobile menu when clicking outside
   document.addEventListener('click', function(e) {
      if (navMenu.classList.contains('active') && 
          !navMenu.contains(e.target) && 
          !mobileMenuBtn.contains(e.target)) {
         mobileMenuBtn.classList.remove('active');
         navMenu.classList.remove('active');
         unlockScroll();
      }
   });

   // Handle keyboard navigation
   document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
         mobileMenuBtn.classList.remove('active');
         navMenu.classList.remove('active');
         unlockScroll();
      }
   });

   // Add parallax effect to hero section
   const hero = document.querySelector('.hero');
   if (hero) {
      window.addEventListener('scroll', function() {
         const scrolled = window.pageYOffset;
         const parallax = scrolled * 0.5;
         hero.style.transform = `translateY(${parallax}px)`;
      });
   }

   // Language Switcher (Safari compatible)
   const langButtons = document.querySelectorAll('.lang-btn');
   let currentLang = 'en';

   // Safari-compatible localStorage check
   function getStoredLanguage() {
      try {
         return localStorage.getItem('language') || 'en';
      } catch (e) {
         return 'en';
      }
   }

   function setStoredLanguage(lang) {
      try {
         localStorage.setItem('language', lang);
      } catch (e) {
         console.warn('Could not save language preference');
      }
   }

   // Initialize language
   function initLanguage() {
      currentLang = getStoredLanguage();
      document.documentElement.lang = currentLang;
      updateLanguage(currentLang);
      updateActiveLanguageButton(currentLang);
   }

   // Update all translatable content
   function updateLanguage(lang) {
      const elements = document.querySelectorAll('[data-en][data-de]');
      elements.forEach(element => {
         const text = element.getAttribute(`data-${lang}`);
         if (text) {
            element.textContent = text;
         }
      });
   }

   // Update active language button
   function updateActiveLanguageButton(lang) {
      langButtons.forEach(btn => {
         btn.classList.remove('active');
         if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
         }
      });
   }

   // Handle language button clicks
   langButtons.forEach(btn => {
      btn.addEventListener('click', function(e) {
         e.preventDefault();
         const selectedLang = this.getAttribute('data-lang');
         currentLang = selectedLang;
         setStoredLanguage(selectedLang);
         document.documentElement.lang = selectedLang;
         updateLanguage(selectedLang);
         updateActiveLanguageButton(selectedLang);
      });
   });

   // Initialize language on page load
   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initLanguage);
   } else {
      initLanguage();
   }

   // Cookie Consent Management
   const cookieBanner = document.getElementById('cookie-banner');
   const cookieModal = document.getElementById('cookie-settings-modal');
   const cookieAcceptAll = document.getElementById('cookie-accept-all');
   const cookieReject = document.getElementById('cookie-reject');
   const cookieSettings = document.getElementById('cookie-settings');
   const cookieModalClose = document.getElementById('cookie-modal-close');
   const cookieSaveSettings = document.getElementById('cookie-save-settings');
   const cookieAcceptAllModal = document.getElementById('cookie-accept-all-modal');

   // Cookie consent storage keys
   const COOKIE_CONSENT_KEY = 'cookieConsent';
   const COOKIE_SETTINGS_KEY = 'cookieSettings';

   // Initialize cookie banner
   function initCookieBanner() {
      const consent = getCookieConsent();
      if (!consent) {
         showCookieBanner();
      } else {
         applyCookieSettings(consent);
      }
   }

   // Get cookie consent from localStorage
   function getCookieConsent() {
      try {
         const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
         return consent ? JSON.parse(consent) : null;
      } catch (e) {
         return null;
      }
   }

   // Save cookie consent to localStorage
   function saveCookieConsent(consent) {
      try {
         localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
         localStorage.setItem(COOKIE_SETTINGS_KEY, JSON.stringify(consent));
      } catch (e) {
         console.warn('Could not save cookie consent');
      }
   }

   // Show cookie banner
   function showCookieBanner() {
      if (cookieBanner) {
         setTimeout(() => {
            cookieBanner.classList.add('show');
         }, 1000); // Show after 1 second
      }
   }

   // Hide cookie banner
   function hideCookieBanner() {
      if (cookieBanner) {
         cookieBanner.classList.remove('show');
         setTimeout(() => {
            cookieBanner.style.display = 'none';
         }, 300);
      }
   }

   // Show cookie settings modal
   function showCookieModal() {
      if (cookieModal) {
         cookieModal.classList.add('show');
         document.body.style.overflow = 'hidden';
      }
   }

   // Hide cookie settings modal
   function hideCookieModal() {
      if (cookieModal) {
         cookieModal.classList.remove('show');
         document.body.style.overflow = '';
      }
   }

   // Apply cookie settings
   function applyCookieSettings(consent) {
      // Essential cookies are always enabled
      if (consent.essential) {
         // Essential cookies are always active
      }

      // Analytics cookies
      if (consent.analytics) {
         // Enable analytics tracking here
         console.log('Analytics cookies enabled');
      } else {
         // Disable analytics tracking
         console.log('Analytics cookies disabled');
      }

      // Functional cookies
      if (consent.functional) {
         // Enable functional features like language preferences
         console.log('Functional cookies enabled');
      } else {
         // Disable functional features
         console.log('Functional cookies disabled');
      }
   }

   // Accept all cookies
   function acceptAllCookies() {
      const consent = {
         essential: true,
         analytics: true,
         functional: true,
         timestamp: new Date().toISOString()
      };
      saveCookieConsent(consent);
      applyCookieSettings(consent);
      hideCookieBanner();
      hideCookieModal();
   }

   // Reject all cookies (except essential)
   function rejectAllCookies() {
      const consent = {
         essential: true,
         analytics: false,
         functional: false,
         timestamp: new Date().toISOString()
      };
      saveCookieConsent(consent);
      applyCookieSettings(consent);
      hideCookieBanner();
      hideCookieModal();
   }

   // Save custom cookie settings
   function saveCustomSettings() {
      const essential = document.getElementById('essential-cookies').checked;
      const analytics = document.getElementById('analytics-cookies').checked;
      const functional = document.getElementById('functional-cookies').checked;

      const consent = {
         essential: essential,
         analytics: analytics,
         functional: functional,
         timestamp: new Date().toISOString()
      };

      saveCookieConsent(consent);
      applyCookieSettings(consent);
      hideCookieBanner();
      hideCookieModal();
   }

   // Load saved cookie settings into modal
   function loadCookieSettings() {
      const consent = getCookieConsent();
      if (consent) {
         document.getElementById('essential-cookies').checked = consent.essential;
         document.getElementById('analytics-cookies').checked = consent.analytics;
         document.getElementById('functional-cookies').checked = consent.functional;
      }
   }

   // Event listeners for cookie banner
   if (cookieAcceptAll) {
      cookieAcceptAll.addEventListener('click', acceptAllCookies);
   }

   if (cookieReject) {
      cookieReject.addEventListener('click', rejectAllCookies);
   }

   if (cookieSettings) {
      cookieSettings.addEventListener('click', function() {
         loadCookieSettings();
         showCookieModal();
      });
   }

   if (cookieModalClose) {
      cookieModalClose.addEventListener('click', hideCookieModal);
   }

   if (cookieSaveSettings) {
      cookieSaveSettings.addEventListener('click', saveCustomSettings);
   }

   if (cookieAcceptAllModal) {
      cookieAcceptAllModal.addEventListener('click', acceptAllCookies);
   }

   // Close modal when clicking outside
   if (cookieModal) {
      cookieModal.addEventListener('click', function(e) {
         if (e.target === cookieModal) {
            hideCookieModal();
         }
      });
   }

   // Close modal with Escape key
   document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && cookieModal.classList.contains('show')) {
         hideCookieModal();
      }
   });

   // Initialize cookie banner on page load
   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initCookieBanner);
   } else {
      initCookieBanner();
   }

   // Log console message
   console.log('%c👋 Hi there!', 'font-size: 24px; font-weight: bold; color: #2563eb;');
   console.log('%cThanks for checking out my website!', 'font-size: 14px; color: #475569;');

})();

