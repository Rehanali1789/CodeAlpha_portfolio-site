/* ===== IMAGE CONFIG — change URLs here to update photos ===== */
const IMAGES = {
  profile: 'https://avatars.githubusercontent.com/u/9919?s=400',
  project1: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=220&fit=crop',
  project2: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=220&fit=crop',
  project3: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=220&fit=crop',
  project4: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=400&h=220&fit=crop',
  project5: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=220&fit=crop',
  project6: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=220&fit=crop',
};

/* Apply images from config */
window.addEventListener('DOMContentLoaded', () => {
  const heroImg = document.getElementById('hero-img');
  if (heroImg) heroImg.src = IMAGES.profile;

  const projectImgs = document.querySelectorAll('.project-img img');
  const keys = ['project1','project2','project3','project4','project5','project6'];
  projectImgs.forEach((img, i) => {
    if (keys[i]) img.src = IMAGES[keys[i]];
    /* fallback if image fails to load */
    img.onerror = () => {
      img.style.display = 'none';
      img.parentElement.style.background = 'linear-gradient(135deg, #1e293b, #0f172a)';
    };
  });

  /* profile fallback — no external URL needed */
  if (heroImg) {
    heroImg.onerror = () => {
      heroImg.style.display = 'none';
      heroImg.parentElement.style.background = 'linear-gradient(135deg, #00E5FF22, #7C3AED44)';
    };
  }
});

/* ===== LOADER ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    initReveal();
  }, 900);
});

/* ===== SCROLL PROGRESS ===== */
window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('scroll-progress').style.width = scrolled + '%';
  updateActiveNav();
});

/* ===== PARTICLES ===== */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,229,255,${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  // draw connecting lines
  particles.forEach((p, i) => {
    particles.slice(i + 1).forEach(q => {
      const dist = Math.hypot(p.x - q.x, p.y - q.y);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(0,229,255,${0.08 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ===== TYPING ANIMATION ===== */
const phrases = ['Web Developer', 'Frontend Engineer', 'UI/UX Designer', 'Python Developer', 'Problem Solver'];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  const current = phrases[phraseIdx];
  if (deleting) {
    typedEl.textContent = current.slice(0, --charIdx);
  } else {
    typedEl.textContent = current.slice(0, ++charIdx);
  }
  let delay = deleting ? 60 : 100;
  if (!deleting && charIdx === current.length) { delay = 1800; deleting = true; }
  else if (deleting && charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; delay = 400; }
  setTimeout(type, delay);
}
type();

/* ===== NAVBAR ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
// Close mobile nav on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  sections.forEach(section => {
    const top = section.offsetTop - 80;
    const bottom = top + section.offsetHeight;
    const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
    if (link) link.classList.toggle('active', window.scrollY >= top && window.scrollY < bottom);
  });
}

/* theme toggle removed */

/* ===== SCROLL REVEAL ===== */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Skill bars
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        // Counters
        entry.target.querySelectorAll('.stat-number').forEach(el => animateCounter(el));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Also observe skill cards for bars
  document.querySelectorAll('.skill-card').forEach(card => observer.observe(card));
  document.querySelectorAll('.about-stats').forEach(el => observer.observe(el));
}

/* ===== ANIMATED COUNTERS ===== */
function animateCounter(el) {
  if (el.dataset.animated) return;
  el.dataset.animated = true;
  const target = +el.dataset.target;
  const duration = 1500;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current >= target) clearInterval(timer);
  }, 16);
}

/* ===== PROJECT FILTERING ===== */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      // Animate back in
      if (match) { card.style.animation = 'none'; requestAnimationFrame(() => { card.style.animation = ''; }); }
    });
  });
});

/* ===== CONTACT FORM ===== */
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  let valid = true;

  const fields = [
    { id: 'name', errorId: 'name-error', msg: 'Please enter your name.' },
    { id: 'email', errorId: 'email-error', msg: 'Please enter a valid email.', isEmail: true },
    { id: 'subject', errorId: 'subject-error', msg: 'Please enter a subject.' },
    { id: 'message', errorId: 'message-error', msg: 'Please enter your message.' },
  ];

  fields.forEach(f => {
    const input = document.getElementById(f.id);
    const error = document.getElementById(f.errorId);
    const val = input.value.trim();
    let err = '';
    if (!val) err = f.msg;
    else if (f.isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) err = f.msg;
    input.classList.toggle('error', !!err);
    error.textContent = err;
    if (err) valid = false;
  });

  if (valid) {
    const btn = this.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      document.getElementById('form-success').classList.add('show');
      this.reset();
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.disabled = false;
      setTimeout(() => document.getElementById('form-success').classList.remove('show'), 4000);
    }, 1200);
  }
});
