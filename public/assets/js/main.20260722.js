document.documentElement.classList.add("js");

const MAP_EMBED_URL = "https://www.google.com/maps?q=-26.494759,-55.273071&z=15&output=embed";

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initMap();
  initTracking();
  updateYear();
});

function initNavigation() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");

  if (!header || !toggle || !nav) return;

  const closeMenu = ({ restoreFocus = false } = {}) => {
    header.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("is-open")) {
      closeMenu({ restoreFocus: true });
    }
  });

  document.addEventListener("click", (event) => {
    if (header.classList.contains("is-open") && !header.contains(event.target)) {
      closeMenu();
    }
  });
}

function initMap() {
  const button = document.querySelector("[data-load-map]");
  const shell = document.querySelector("[data-map-shell]");

  if (!button || !shell) return;

  button.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = MAP_EMBED_URL;
    iframe.title = "Ubicación de Éden Loteamiento en María Auxiliadora";
    iframe.loading = "eager";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.allowFullscreen = true;
    shell.replaceChildren(iframe);
    trackEvent("map_loaded", { placement: "location" });
  }, { once: true });
}

function initTracking() {
  document.querySelectorAll("[data-track]").forEach((element) => {
    element.addEventListener("click", () => {
      trackEvent("contact_action", {
        action: element.dataset.track,
        destination: element.getAttribute("href") || ""
      });
    });
  });

  document.querySelectorAll("details").forEach((details) => {
    details.addEventListener("toggle", () => {
      if (details.open) {
        trackEvent("faq_open", { question: details.querySelector("summary")?.textContent.trim() || "" });
      }
    });
  });
}

function trackEvent(name, parameters = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...parameters });

  if (window.zaraz && typeof window.zaraz.track === "function") {
    window.zaraz.track(name, parameters);
  }
}

function updateYear() {
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
}
