/**
 * Piyush Pandey Portfolio
 * Minimal JavaScript for scroll-based animations
 * Respects user preferences for reduced motion
 */

(function() {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Page Loader
   */
  function initLoader() {
    const loader = document.querySelector('.loader');
    if (!loader) return;
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 500);
    });
    
    // Fallback: hide loader after 3 seconds max
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 3000);
  }

  /**
   * Custom Cursor
   */
  function initCustomCursor() {
    // Only on devices with fine pointer (mouse)
    if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion) return;
    
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
      // Cursor follows instantly
      cursorX = mouseX;
      cursorY = mouseY;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      
      // Follower has lag
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover states
    const interactiveElements = document.querySelectorAll('a, button, .project-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => follower.classList.add('hover'));
      el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });
  }

  /**
   * Mobile Navigation
   */
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!toggle || !navLinks) return;
    
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /**
   * Intersection Observer for reveal animations
   */
  function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    
    if (prefersReducedMotion) {
      // If reduced motion is preferred, show all elements immediately
      reveals.forEach(el => el.classList.add('active'));
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    reveals.forEach(reveal => {
      revealObserver.observe(reveal);
    });
  }

  /**
   * Smooth scroll for anchor links
   */
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (!target) return;
        
        e.preventDefault();
        
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset;
        const navHeight = document.querySelector('.nav').offsetHeight;
        
        window.scrollTo({
          top: offsetTop - navHeight,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      });
    });
  }

  /**
   * Navigation scroll effect
   */
  function initNavScrollEffect() {
    const nav = document.querySelector('.nav');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNav() {
      const scrollY = window.scrollY;
      
      if (scrollY > 100) {
        nav.style.background = 'rgba(0, 0, 0, 0.95)';
      } else {
        nav.style.background = 'rgba(0, 0, 0, 0.8)';
      }
      
      lastScrollY = scrollY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNav);
        ticking = true;
      }
    }, { passive: true });
  }

  /**
   * Active navigation link highlighting
   */
  function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (!sections.length || !navLinks.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${id}`) {
              link.style.color = 'var(--color-text)';
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  }

  /**
   * Project card hover physics
   */
  function initProjectCardInteractions() {
    if (prefersReducedMotion) return;
    
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }

  /**
   * Initialize hero section with staggered animation
   */
  function initHeroAnimation() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.hero .reveal').forEach(el => {
        el.classList.add('active');
      });
      return;
    }
    
    // Add slight delay before starting hero animations
    setTimeout(() => {
      document.querySelectorAll('.hero .reveal').forEach(el => {
        el.classList.add('active');
      });
    }, 100);
  }

  /**
   * Handle external links - add security attributes
   */
  function initExternalLinks() {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    
    externalLinks.forEach(link => {
      if (!link.hasAttribute('rel')) {
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  /**
   * Keyboard navigation support
   */
  function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Skip navigation on Tab
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });
  }

  /**
   * Initialize all modules
   */
  function init() {
    // Wait for DOM to be fully loaded
    initLoader();
    initCustomCursor();
    initMobileNav();
    initHeroAnimation();
    initRevealAnimations();
    initSmoothScroll();
    initNavScrollEffect();
    initActiveNavHighlight();
    initProjectCardInteractions();
    initExternalLinks();
    initKeyboardNavigation();
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

