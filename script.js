const menuToggle = document.querySelector(".menu-toggle");
const sideMenu = document.querySelector(".side-menu");
const menuBackdrop = document.querySelector(".menu-backdrop");
const menuLinks = document.querySelectorAll(".side-menu a");
const themeSelect = document.querySelector("#themeSelect");
const sections = document.querySelectorAll("main section, footer");
const revealItems = document.querySelectorAll(".reveal");
const heroSection = document.querySelector(".hero-section");
const modalTriggers = document.querySelectorAll("[data-modal-target]");
const modalClosers = document.querySelectorAll("[data-modal-close]");

function setMenu(open) {
  sideMenu.classList.toggle("is-open", open);
  sideMenu.setAttribute("aria-hidden", String(!open));
  menuToggle.setAttribute("aria-expanded", String(open));
  menuBackdrop.hidden = !open;
}

menuToggle.addEventListener("click", () => {
  setMenu(!sideMenu.classList.contains("is-open"));
});

menuBackdrop.addEventListener("click", () => setMenu(false));

menuLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

themeSelect.addEventListener("change", (event) => {
  document.body.dataset.theme = event.target.value;
  localStorage.setItem("portfolio-theme", event.target.value);
});

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme) {
  document.body.dataset.theme = savedTheme;
  themeSelect.value = savedTheme;
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const activeLink = document.querySelector(`.side-menu a[href="#${entry.target.id}"]`);
      if (entry.isIntersecting && activeLink) {
        menuLinks.forEach((link) => link.classList.remove("is-active"));
        activeLink.classList.add("is-active");
      }
    });
  },
  { rootMargin: "-35% 0px -55% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

function updateHeroImageFade() {
  const heroHeight = heroSection.offsetHeight || window.innerHeight;
  const progress = Math.min(Math.max(window.scrollY / (heroHeight * 0.72), 0), 1);
  document.body.style.setProperty("--hero-image-opacity", String(1 - progress));
}

updateHeroImageFade();
window.addEventListener("scroll", updateHeroImageFade, { passive: true });
window.addEventListener("resize", updateHeroImageFade);

function setModal(modal, open) {
  modal.classList.toggle("is-open", open);
  modal.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("modal-open", open);
}

modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const modal = document.getElementById(trigger.dataset.modalTarget);
    if (modal) setModal(modal, true);
  });
});

modalClosers.forEach((closer) => {
  closer.addEventListener("click", () => {
    const modal = closer.closest(".detail-modal");
    if (modal) setModal(modal, false);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelectorAll(".detail-modal.is-open").forEach((modal) => setModal(modal, false));
  }
});
