document.addEventListener('DOMContentLoaded', function () {
  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('li').forEach((item, index) => {
    item.classList.add('animate-on-scroll');
    observer.observe(item);
    item.style.animationDelay = `${index * 0.1}s`;
  });

  // Form input focus styles
  document.querySelectorAll('input, textarea, select').forEach((input) => {
    input.addEventListener('focus', function () {
      this.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', function () {
      this.parentElement.classList.remove('focused');
    });
  });

  // Ripple effect
  document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600); // Fixed: match animation duration
    });
  });

  // Form submit loading
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', function () {
      const submitBtn = this.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '<span class="loading"></span> Processing...';
        submitBtn.disabled = true;
      }
    });
  });

  // Hover effects
  document.querySelectorAll('li').forEach((item) => {
    item.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    item.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Auto-hide alerts/messages
  setTimeout(() => {
    document.querySelectorAll('.message, .alert').forEach((msg) => {
      msg.style.animation = 'slideOutUp 0.5s ease-out forwards';
      setTimeout(() => msg.remove(), 500); // Fixed: matches animation duration
    });
  }, 5000);

  // Particle explosion
  function createParticles(element) {
    for (let i = 0; i < 10; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: #10b981;
        border-radius: 50%;
        pointer-events: none;
        animation: particle-explosion 1s ease-out forwards;
      `;
      const rect = element.getBoundingClientRect();
      particle.style.left = rect.left + rect.width / 2 + 'px';
      particle.style.top = rect.top + rect.height / 2 + 'px';

      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1000); // Fixed: match animation duration
    }
  }

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth',
      });
    });
  });

  // Typewriter effect
  function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  // Reduced motion setting
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-medium', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
  }

  // Inject CSS keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to { transform: scale(4); opacity: 0; }
    }
    @keyframes particle-explosion {
      0% { transform: scale(1) translateY(0); opacity: 1; }
      100% {
        transform: scale(0) translateY(-50px) translateX(${
          Math.random() * 100 - 50
        }px);
        opacity: 0;
      }
    }
    @keyframes slideOutUp {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(-20px); opacity: 0; }
    }
    .focused {
      transform: scale(1.02);
      transition: transform 0.3s ease;
    }
    @media (max-width: 768px) {
      .navbar .container {
        flex-direction: column;
        gap: 15px;
      }
      .nav-links {
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  `;
  document.head.appendChild(style);
});
