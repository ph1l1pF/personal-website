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

   // Theme Toggle
   const themeToggle = document.getElementById('theme-toggle');

   function getStoredTheme() {
      try {
         return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
      } catch (e) {
         return 'light';
      }
   }

   function setStoredTheme(theme) {
      try {
         localStorage.setItem('theme', theme);
      } catch (e) {
         console.warn('Could not save theme preference');
      }
   }

   function updateThemeToggle(theme) {
      if (!themeToggle) return;

      const icon = themeToggle.querySelector('i');
      const isDark = theme === 'dark';

      if (icon) {
         icon.className = 'fa fa-moon-o';
      }

      themeToggle.setAttribute('aria-pressed', isDark);
      const lang = document.documentElement.lang || 'en';
      themeToggle.setAttribute(
         'aria-label',
         lang === 'de'
            ? (isDark ? 'Hellmodus aktivieren' : 'Dunkelmodus aktivieren')
            : (isDark ? 'Switch to light mode' : 'Switch to dark mode')
      );
   }

   function setTheme(theme) {
      if (theme === 'dark') {
         document.documentElement.setAttribute('data-theme', 'dark');
      } else {
         document.documentElement.removeAttribute('data-theme');
      }
      setStoredTheme(theme);
      updateThemeToggle(theme);
   }

   function initTheme() {
      setTheme(getStoredTheme());
   }

   if (themeToggle) {
      themeToggle.addEventListener('click', function() {
         const nextTheme = getStoredTheme() === 'dark' ? 'light' : 'dark';
         setTheme(nextTheme);
      });
   }

   // Language Switcher (Safari compatible)
   const langButtons = document.querySelectorAll('.lang-btn');
   let currentLang = 'en';
   const CAREER_START_YEAR = 2019;
   const CONTACT_EMAIL = 'hi@philip-frerk.de';
   const SITE_ORIGIN = 'https://philip-frerk.de';

   function getYearsOfExperience() {
      return new Date().getFullYear() - CAREER_START_YEAR;
   }

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

   function getLangFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const lang = params.get('lang');
      return lang === 'de' || lang === 'en' ? lang : null;
   }

   function buildLangUrl(lang) {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);

      if (url.pathname.endsWith('/index.html')) {
         url.pathname = url.pathname.replace(/index\.html$/, '');
      }

      if (url.pathname === '' || url.pathname === '/') {
         return SITE_ORIGIN + '/?lang=' + lang;
      }

      return SITE_ORIGIN + url.pathname + '?lang=' + lang;
   }

   function syncLangToUrl(lang) {
      const nextUrl = buildLangUrl(lang);
      if (window.location.href !== nextUrl) {
         history.replaceState(null, '', nextUrl);
      }
      updateSeoTags(lang);
   }

   function updateSeoTags(lang) {
      document.documentElement.lang = lang;

      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
         canonical.href = buildLangUrl(lang);
      }

      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) {
         ogUrl.setAttribute('content', buildLangUrl(lang));
      }

      const ogLocale = document.querySelector('meta[property="og:locale"]');
      if (ogLocale) {
         ogLocale.setAttribute('content', lang === 'de' ? 'de_DE' : 'en_US');
      }
   }

   // Initialize language
   function initLanguage() {
      currentLang = getLangFromUrl() || getStoredLanguage();
      setStoredLanguage(currentLang);
      document.documentElement.lang = currentLang;
      updateLanguage(currentLang);
      updateActiveLanguageButton(currentLang);
      syncLangToUrl(currentLang);
   }

   // Update all translatable content
   function updateLanguage(lang) {
      const years = getYearsOfExperience();
      const elements = document.querySelectorAll('[data-en][data-de]:not(.theme-toggle)');
      elements.forEach(element => {
         const text = element.getAttribute(`data-${lang}`);
         if (text) {
            element.textContent = text.replace(/\{years\}/g, years);
         }
      });

      document.querySelectorAll('[data-years-suffix]').forEach(element => {
         const suffix = element.getAttribute('data-years-suffix') || '';
         element.textContent = years + suffix;
      });

      document.querySelectorAll('[data-lang-block]').forEach(block => {
         block.hidden = block.getAttribute('data-lang-block') !== lang;
      });

      const pageTitle = document.querySelector('title[data-en][data-de]');
      if (pageTitle) {
         const title = pageTitle.getAttribute(`data-${lang}`);
         if (title) {
            pageTitle.textContent = title;
         }
      }

      updateThemeToggle(getStoredTheme());
      updateMailtoLinks(lang);
   }

   function updateMailtoLinks(lang) {
      document.querySelectorAll('[data-mailto-subject-en][data-mailto-subject-de]').forEach(element => {
         const subject = element.getAttribute(`data-mailto-subject-${lang}`) || '';
         element.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
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
         syncLangToUrl(selectedLang);
      });
   });

   // Initialize language on page load
   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
         initTheme();
         initLanguage();
      });
   } else {
      initTheme();
      initLanguage();
   }

   // Cookie consent (localStorage preferences only — no analytics)
   const cookieBanner = document.getElementById('cookie-banner');
   const cookieAccept = document.getElementById('cookie-accept');
   const COOKIE_CONSENT_KEY = 'cookieConsent';

   function getCookieConsent() {
      try {
         const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
         return consent ? JSON.parse(consent) : null;
      } catch (e) {
         return null;
      }
   }

   function saveCookieConsent(consent) {
      try {
         localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
      } catch (e) {
         console.warn('Could not save cookie consent');
      }
   }

   function showCookieBanner() {
      if (cookieBanner) {
         setTimeout(function() {
            cookieBanner.classList.add('show');
         }, 1000);
      }
   }

   function hideCookieBanner() {
      if (cookieBanner) {
         cookieBanner.classList.remove('show');
         setTimeout(function() {
            cookieBanner.style.display = 'none';
         }, 300);
      }
   }

   function acceptCookieConsent() {
      saveCookieConsent({
         accepted: true,
         timestamp: new Date().toISOString()
      });
      hideCookieBanner();
   }

   function initCookieBanner() {
      if (!getCookieConsent()) {
         showCookieBanner();
      }
   }

   if (cookieAccept) {
      cookieAccept.addEventListener('click', acceptCookieConsent);
   }

   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initCookieBanner);
   } else {
      initCookieBanner();
   }

   // Log console message
   console.log('%c👋 Hi there!', 'font-size: 24px; font-weight: bold; color: #2563eb;');
   console.log('%cThanks for checking out my website!', 'font-size: 14px; color: #475569;');

})();

