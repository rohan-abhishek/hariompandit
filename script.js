/* =========================================================
   Pandit Shri [Name] — Interactions
========================================================= */
(function () {
  "use strict";

  /* ---------- Loader ---------- */
  window.addEventListener("load", function () {
    const loader = document.getElementById("loader");
    if (loader) {
      setTimeout(() => loader.classList.add("hidden"), 600);
    }
  });

  /* ---------- Theme Toggle (persisted) ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle ? themeToggle.querySelector("i") : null;

  const savedTheme = localStorage.getItem("pandit-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
  applyTheme(initialTheme);

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeIcon) {
      themeIcon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("pandit-theme", next);
    });
  }

  /* ---------- Sticky Navbar ---------- */
  const navbar = document.getElementById("navbar");
  const toTop = document.getElementById("toTop");

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle("scrolled", y > 40);
    if (toTop) toTop.classList.toggle("show", y > 500);
    setActiveLink();
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile Menu ---------- */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        hamburger.classList.remove("open");
        navLinks.classList.remove("open");
      })
    );
  }

  /* ---------- Active Link on Scroll ---------- */
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-link");

  function setActiveLink() {
    let current = "";
    const pos = window.scrollY + 120;
    sections.forEach((sec) => {
      if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
        current = sec.id;
      }
    });
    links.forEach((l) => {
      l.classList.toggle("active", l.getAttribute("href") === "#" + current);
    });
  }

  /* ---------- Scroll Reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Scroll to Top ---------- */
  if (toTop) {
    toTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  /* ---------- Service "Book Now" -> prefill form ---------- */
  const pujaSelect = document.getElementById("puja");
  document.querySelectorAll(".book-service").forEach((btn) => {
    btn.addEventListener("click", () => {
      const service = btn.getAttribute("data-service");
      if (pujaSelect) {
        [...pujaSelect.options].forEach((o) => {
          if (o.text.trim() === service) pujaSelect.value = o.value || o.text;
        });
      }
      document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ---------- Gallery Lightbox ---------- */
  const galleryImgs = Array.from(document.querySelectorAll(".gallery-grid img"));
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  let lbIndex = 0;

  function openLightbox(i) {
    lbIndex = i;
    lbImg.src = galleryImgs[i].src;
    lightbox.classList.add("open");
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
  }
  function showRelative(step) {
    lbIndex = (lbIndex + step + galleryImgs.length) % galleryImgs.length;
    lbImg.src = galleryImgs[lbIndex].src;
  }

  galleryImgs.forEach((img, i) => img.addEventListener("click", () => openLightbox(i)));
  if (lightbox) {
    document.getElementById("lbClose").addEventListener("click", closeLightbox);
    document.getElementById("lbNext").addEventListener("click", () => showRelative(1));
    document.getElementById("lbPrev").addEventListener("click", () => showRelative(-1));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showRelative(1);
      if (e.key === "ArrowLeft") showRelative(-1);
    });
  }

  /* ---------- Testimonials Slider ---------- */
  const track = document.getElementById("sliderTrack");
  const slides = track ? track.querySelectorAll(".slide") : [];
  const dotsWrap = document.getElementById("dots");
  let slideIndex = 0;
  let autoTimer;

  if (track && slides.length) {
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", "Go to review " + (i + 1));
      if (i === 0) b.classList.add("active");
      b.addEventListener("click", () => goToSlide(i));
      dotsWrap.appendChild(b);
    });

    function goToSlide(i) {
      slideIndex = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${slideIndex * 100}%)`;
      dotsWrap.querySelectorAll("button").forEach((d, idx) =>
        d.classList.toggle("active", idx === slideIndex)
      );
    }

    function startAuto() {
      autoTimer = setInterval(() => goToSlide(slideIndex + 1), 5000);
    }
    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    if (nextBtn) nextBtn.addEventListener("click", () => { goToSlide(slideIndex + 1); resetAuto(); });
    if (prevBtn) prevBtn.addEventListener("click", () => { goToSlide(slideIndex - 1); resetAuto(); });

    const sliderEl = document.getElementById("slider");
    sliderEl.addEventListener("mouseenter", () => clearInterval(autoTimer));
    sliderEl.addEventListener("mouseleave", startAuto);

    // Touch swipe
    let startX = 0;
    sliderEl.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
    sliderEl.addEventListener("touchend", (e) => {
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 50) { goToSlide(slideIndex + (diff < 0 ? 1 : -1)); resetAuto(); }
    });

    startAuto();
  }

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");
      document.querySelectorAll(".faq-item").forEach((it) => {
        it.classList.remove("active");
        it.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("active");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---------- Booking Form ---------- */
  const form = document.getElementById("bookingForm");
  const note = document.getElementById("formNote");
  const WHATSAPP_NUMBER = "919876543210"; // <-- replace with real number (country code + number)

  function buildMessage() {
    const get = (id) => (document.getElementById(id)?.value || "").trim();
    return (
      `*New Puja Booking Request*%0A` +
      `Name: ${get("name")}%0A` +
      `Phone: ${get("phone")}%0A` +
      `Email: ${get("email")}%0A` +
      `Address: ${get("address")}%0A` +
      `Puja Type: ${get("puja")}%0A` +
      `Date: ${get("date")}%0A` +
      `Message: ${get("message")}`
    );
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      note.hidden = false;
      note.textContent = "🙏 Thank you! Your request has been received. Pandit Ji will contact you shortly.";
      form.reset();
    });

    document.getElementById("waBooking").addEventListener("click", () => {
      const required = ["name", "phone", "address", "puja", "date"];
      const missing = required.some((id) => !(document.getElementById(id)?.value || "").trim());
      if (missing) {
        note.hidden = false;
        note.textContent = "Please fill your name, phone, address, puja type and date before booking on WhatsApp.";
        form.reportValidity();
        return;
      }
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${buildMessage()}`, "_blank");
    });
  }

  /* ---------- Footer Year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // initial run
  onScroll();
})();