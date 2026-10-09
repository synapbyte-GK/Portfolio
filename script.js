/**
 * ============================================================
 * GANESH KUMAR — PORTFOLIO JAVASCRIPT
 * Features: Preloader, Particles, Typing Effect, Dark/Light Mode,
 *           Scroll Animations (AOS), Skill Bars, Navbar, Contact Form
 * ============================================================
 */

/* ========================
   1. PRELOADER
======================== */
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  setTimeout(() => {
    preloader.classList.add("hidden");
    // Trigger AOS animations after preloader
    document.querySelectorAll("[data-aos]").forEach((el) => {
      if (isInViewport(el)) animateIn(el);
    });
  }, 1600);
});

/* ========================
   2. CUSTOM CURSOR
======================== */
const cursor = document.getElementById("cursor");
const follower = document.getElementById("cursor-follower");
let mouseX = 0,
  mouseY = 0,
  fx = 0,
  fy = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";
});

function followCursor() {
  fx += (mouseX - fx) * 0.12;
  fy += (mouseY - fy) * 0.12;
  follower.style.left = fx + "px";
  follower.style.top = fy + "px";
  requestAnimationFrame(followCursor);
}
followCursor();

// Hide default cursor on canvas
document.body.style.cursor = "none";

/* ========================
   3. PARTICLE BACKGROUND
======================== */
(function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas.getContext("2d");
  let W,
    H,
    particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", () => {
    resize();
    spawnParticles();
  });

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 2 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.5 + 0.15;
    const palette = ["#7c3aed", "#06b6d4", "#f472b6", "#a78bfa", "#38bdf8"];
    this.color = palette[Math.floor(Math.random() * palette.length)];
  };
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  };
  Particle.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  function spawnParticles() {
    particles = [];
    const count = Math.min(120, Math.floor((W * H) / 8000));
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 100) * 0.1;
          ctx.strokeStyle = "#7c3aed";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  spawnParticles();
  animate();
})();

/* ========================
   4. TYPING EFFECT
======================== */
(function initTyping() {
  const roles = [
    "B.Tech CSE (IoT) Student",
    "Web Developer",
    "Python Programmer",
    "Java Developer",
    "DSA Enthusiast",
    "Problem Solver",
  ];
  let roleIndex = 0,
    charIndex = 0,
    deleting = false;
  const el = document.getElementById("typed-text");
  if (!el) return;

  function type() {
    const current = roles[roleIndex];
    el.textContent = deleting
      ? current.substring(0, charIndex--)
      : current.substring(0, charIndex++);

    let delay = deleting ? 60 : 110;

    if (!deleting && charIndex > current.length) {
      delay = 1800;
      deleting = true;
    } else if (deleting && charIndex < 0) {
      deleting = false;
      charIndex = 0;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }
    setTimeout(type, delay);
  }
  setTimeout(type, 800);
})();

/* ========================
   5. DARK / LIGHT MODE
======================== */
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const html = document.documentElement;

// Read saved preference
const savedTheme = localStorage.getItem("gk-theme") || "dark";
html.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("gk-theme", next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
}

/* ========================
   6. STICKY NAVBAR + ACTIVE LINK
======================== */
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");

function updateNavbar() {
  if (window.scrollY > 30) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  // Active section highlight
  let current = "";
  sections.forEach((sec) => {
    const top = sec.offsetTop - 100;
    const height = sec.offsetHeight;
    if (window.scrollY >= top && window.scrollY < top + height) {
      current = sec.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
}

/* ========================
   7. HAMBURGER MENU
======================== */
const hamburger = document.getElementById("hamburger");
const mobileLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileLinks.classList.toggle("open");
});
mobileLinks.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileLinks.classList.remove("open");
  });
});

/* ========================
   8. SCROLL ANIMATIONS (AOS Lite)
======================== */
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight - 80;
}

function animateIn(el) {
  el.classList.add("aos-animate");
}

function checkAOS() {
  document.querySelectorAll("[data-aos]:not(.aos-animate)").forEach((el) => {
    const delay = parseInt(el.getAttribute("data-aos-delay") || 0);
    if (isInViewport(el)) {
      setTimeout(() => animateIn(el), delay);
    }
  });
}

/* ========================
   9. SKILL BARS ANIMATION
======================== */
let barsAnimated = false;
function animateBars() {
  if (barsAnimated) return;
  const skillsSection = document.getElementById("skills");
  if (!skillsSection) return;
  const rect = skillsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight - 50) {
    barsAnimated = true;
    document.querySelectorAll(".bar-fill").forEach((bar) => {
      const w = bar.getAttribute("data-width");
      bar.style.width = w + "%";
    });
  }
}

/* ========================
   10. BACK TO TOP
======================== */
const backToTop = document.getElementById("backToTop");
function updateBackToTop() {
  if (window.scrollY > 400) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
}
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ========================
   11. SCROLL MASTER LISTENER
======================== */
window.addEventListener(
  "scroll",
  () => {
    updateNavbar();
    checkAOS();
    animateBars();
    updateBackToTop();
  },
  { passive: true },
);

// Initial call
updateNavbar();
checkAOS();

/* ========================
   12. CONTACT FORM
======================== */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const subject = contactForm.subject.value.trim();
    const message = contactForm.message.value.trim();
    let valid = true;

    // Clear errors
    ["nameError", "emailError", "subjectError", "messageError"].forEach(
      (id) => {
        document.getElementById(id).textContent = "";
      },
    );

    // Validation
    if (!name) {
      document.getElementById("nameError").textContent =
        "Please enter your name.";
      valid = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById("emailError").textContent =
        "Please enter a valid email address.";
      valid = false;
    }
    if (!subject) {
      document.getElementById("subjectError").textContent =
        "Please enter a subject.";
      valid = false;
    }
    if (!message) {
      document.getElementById("messageError").textContent =
        "Please enter your message.";
      valid = false;
    }

    if (!valid) return;

    // Build mailto link
    const mailtoTo = "ganeshkjibs8@gmail.com";
    const mailtoSubj = encodeURIComponent(
      `[Portfolio Contact] ${subject} — from ${name}`,
    );
    const mailtoBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    );
    const mailtoLink = `mailto:${mailtoTo}?subject=${mailtoSubj}&body=${mailtoBody}`;

    // Open mail client
    window.location.href = mailtoLink;

    // Show success message
    contactForm.reset();
    const successEl = document.getElementById("formSuccess");
    successEl.classList.remove("hidden");
    setTimeout(() => successEl.classList.add("hidden"), 5000);
  });
}

/* ========================
   13. SMOOTH HOVER TILT ON CARDS
======================== */
document.querySelectorAll(".project-card, .cert-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rx = (y / rect.height) * 6;
    const ry = -(x / rect.width) * 6;
    card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

/* ========================
   14. NAV SMOOTH SCROLL (offset for navbar)
======================== */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const offset = document.getElementById("navbar").offsetHeight + 8;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

/* ========================
   15. ANIMATED GRADIENT BG ON HERO SCROLL
======================== */
window.addEventListener(
  "scroll",
  () => {
    const hero = document.querySelector(".hero-section");
    if (!hero) return;
    const scrolled = window.scrollY;
    const opacity = Math.max(0, 1 - scrolled / 500);
    hero.style.opacity = opacity < 0.3 ? "0.3" : opacity;
  },
  { passive: true },
);

/* Restore full hero opacity on load */
document.querySelector(".hero-section").style.opacity = "1";
