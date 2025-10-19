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

   // Smooth scroll for anchor links
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
            
            window.scrollTo({
               top: offsetTop,
               behavior: 'smooth'
            });
         }
      });
   });

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
         window.scrollTo({
            top: 0,
            behavior: 'smooth'
         });
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

   // Language Switcher
   const langButtons = document.querySelectorAll('.lang-btn');
   let currentLang = localStorage.getItem('language') || 'en';

   // Initialize language
   function initLanguage() {
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
      btn.addEventListener('click', function() {
         const selectedLang = this.getAttribute('data-lang');
         currentLang = selectedLang;
         localStorage.setItem('language', selectedLang);
         document.documentElement.lang = selectedLang;
         updateLanguage(selectedLang);
         updateActiveLanguageButton(selectedLang);
      });
   });

   // Initialize language on page load
   initLanguage();

   // Log console message
   console.log('%c👋 Hi there!', 'font-size: 24px; font-weight: bold; color: #2563eb;');
   console.log('%cThanks for checking out my website!', 'font-size: 14px; color: #475569;');

})();

