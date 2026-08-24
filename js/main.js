const BOOKING_URL_PLACEHOLDER = "#booking-link-placeholder";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

document.querySelectorAll(".site-nav a").forEach((link) => {
  const current = document.body.dataset.page;
  const href = link.getAttribute("href") || "";
  const map = {
    home: "index.html",
    services: "services.html",
    gallery: "gallery.html",
    about: "about.html",
    contact: "contact.html",
    book: "booking.html",
  };

  if (map[current] === href) {
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  }
});

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    });
  });
}

document.querySelectorAll(".image-slot").forEach((slot) => {
  const img = slot.querySelector("img");
  if (!img) {
    slot.classList.add("is-missing");
    return;
  }

  if (img.complete && img.naturalWidth > 0) {
    slot.classList.add("is-loaded");
  }

  img.addEventListener("load", () => {
    slot.classList.add("is-loaded");
    slot.classList.remove("is-missing");
  });

  img.addEventListener("error", () => {
    img.hidden = true;
    slot.classList.add("is-missing");
    slot.classList.remove("is-loaded");
  });
});

document.querySelectorAll("[data-booking-link]").forEach((link) => {
  if (link.getAttribute("href") !== BOOKING_URL_PLACEHOLDER) return;
  link.addEventListener("click", (event) => {
    event.preventDefault();
    link.textContent = "Booking URL needed";
    link.setAttribute("aria-label", "Booking URL still needs to be added");
  });
});

const contactForm = document.querySelector("[data-contact-form]");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const note = contactForm.querySelector("[data-form-note]");
    if (note) note.textContent = "This form needs a connected form service before messages can be sent.";
  });
}

function initLightbox() {
  const modal = document.querySelector("[data-lightbox-modal]");
  if (!modal) return;

  const modalImg = modal.querySelector("[data-lightbox-img]");
  const modalPlaceholder = modal.querySelector("[data-lightbox-placeholder]");
  const title = modal.querySelector("[data-lightbox-title]");
  const close = modal.querySelector("[data-lightbox-close]");

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (modalImg) modalImg.removeAttribute("src");
  }

  document.querySelectorAll("[data-lightbox]").forEach((item) => {
    item.addEventListener("click", () => {
      const src = item.dataset.lightbox;
      const itemTitle = item.dataset.title || "Gallery image";
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      if (title) title.textContent = itemTitle;

      if (modalImg && modalPlaceholder) {
        modalPlaceholder.style.display = "none";
        modalImg.hidden = false;
        modalImg.src = src;
        modalImg.alt = `${itemTitle} preview`;
        modalImg.onerror = () => {
          modalImg.hidden = true;
          modalPlaceholder.textContent = src.split("/").pop();
          modalPlaceholder.style.display = "grid";
        };
      }
    });
  });

  close?.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });
}

initLightbox();

if (!prefersReducedMotion && window.Lenis) {
  const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

if (!prefersReducedMotion && window.gsap) {
  gsap.fromTo(
    ".page-transition",
    { yPercent: 0, opacity: 1 },
    { yPercent: -100, opacity: 1, duration: 0.65, ease: "power3.out" }
  );

  gsap.to(".hero-media img", {
    scale: 1,
    duration: 1.5,
    ease: "power3.out",
  });

  if (window.ScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);

    gsap.utils.toArray(".reveal").forEach((element) => {
      gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 86%",
        },
      });
    });

    gsap.utils.toArray("[data-parallax]").forEach((element) => {
      gsap.to(element, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  } else {
    document.querySelectorAll(".reveal").forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
  }

  document.querySelectorAll('a[href$=".html"], a[href="index.html"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || link.target || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      gsap.to(".page-transition", {
        yPercent: 0,
        opacity: 1,
        duration: 0.32,
        ease: "power2.inOut",
        onComplete: () => {
          window.location.href = href;
        },
      });
    });
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => {
    element.style.opacity = "1";
    element.style.transform = "none";
  });
}
