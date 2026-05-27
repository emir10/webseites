/* Selique Dance – Main JS */

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';

  const spans = menuToggle.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.cssText = 'transform: rotate(45deg) translate(5px, 5px)';
    spans[1].style.cssText = 'opacity: 0';
    spans[2].style.cssText = 'transform: rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => s.style.cssText = '');
  }
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
    menuToggle.querySelectorAll('span').forEach(s => s.style.cssText = '');
  });
});

// Intersection Observer for animations
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all reveal & fade-up elements
document.querySelectorAll('.reveal, .fade-up').forEach(el => observer.observe(el));

// Staggered card animations
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || '0');
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, delay);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.class-card, .instructor-card, .testimonial-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease, border-color 0.4s, box-shadow 0.4s';
  cardObserver.observe(card);
});

// Initial hero reveals on load
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('#hero .reveal').forEach(el => el.classList.add('visible'));
  }, 100);
});

// About section cards fade-in
const aboutObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.about-card').forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = card.style.transform.replace('translateY(20px)', 'translateY(0)') || 'translateY(0)';
        }, i * 150);
      });
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('#about .about-visual').forEach(el => {
  el.querySelectorAll('.about-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  aboutObserver.observe(el);
});

// Smooth parallax on hero
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const heroContent = document.querySelector('.hero-content');
      if (heroContent && window.scrollY < window.innerHeight) {
        heroContent.style.transform = `translateY(${window.scrollY * 0.25}px)`;
        heroContent.style.opacity = 1 - (window.scrollY / (window.innerHeight * 0.7));
      }
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// Contact form
const form = document.getElementById('contactForm');
if (form) {
  // Add success message element
  const successMsg = document.createElement('div');
  successMsg.className = 'success-message';
  successMsg.innerHTML = `
    <h3>Danke!</h3>
    <p>Wir haben deine Nachricht erhalten und melden uns innerhalb von 24 Stunden bei dir.</p>
  `;
  form.appendChild(successMsg);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Wird gesendet…';

    // Simulate submission
    setTimeout(() => {
      form.classList.add('success');
    }, 1200);
  });
}

// Gallery hover ripple effect
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    item.style.background = item.style.background.replace(
      /radial-gradient[^,]*/,
      `radial-gradient(circle at ${x}% ${y}%, rgba(201,169,110,0.15) 0%, transparent 60%)`
    );
  });
});

// Number counter animation for stats
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.textContent);
        const suffix = el.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 40;
        const timer = setInterval(() => {
          current = Math.min(current + increment, target);
          el.textContent = Math.round(current) + suffix;
          if (current >= target) clearInterval(timer);
        }, 40);
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('#about .about-visual').forEach(el => statObserver.observe(el));
