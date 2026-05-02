const WHATSAPP_NUMBER = "595971141032";
const CONTACT_EMAIL = "alemateo07@gmail.com";
const GOOGLE_MAPS_EMBED_URL = "https://www.google.com/maps?q=-26.494759,-55.273071&z=15&output=embed";
const GOOGLE_MAPS_SHARE_URL = "https://maps.app.goo.gl/tpnS1MzXkLu2Yi1o7";
const LOT_SIZE = "14 x 40 m";
const LOT_AREA = "560 m";
const STARTING_PRICE = "Gs. 800.000";
const PROJECT_LOCATION_LABEL = "Tomás Romero Pereira / María Auxiliadora, Itapúa";

const WHATSAPP_MESSAGE = "Hola, quiero consultar por terrenos en Tomás Romero Pereira / María Auxiliadora. Me interesa conocer disponibilidad, ubicación y planes desde Gs. 800.000.";
const EMAIL_SUBJECT = "Consulta por terrenos - Éden Loteamiento";
const EMAIL_BODY = [
    "Hola, quiero consultar por terrenos en Tomás Romero Pereira / María Auxiliadora.",
    "Me interesa conocer disponibilidad, ubicación y condiciones comerciales.",
    `Lote tipo: ${LOT_SIZE} = ${LOT_AREA}.`,
    `Planes desde: ${STARTING_PRICE}.`,
].join("\n");

const LOTES = [
    {
        id: "Lote 01",
        size: LOT_SIZE,
        area: LOT_AREA,
        plan: STARTING_PRICE,
        status: "Disponible",
        summary: "Consulta pensada para primera vivienda con referencia clara y atención directa.",
    },
    {
        id: "Lote 02",
        size: LOT_SIZE,
        area: LOT_AREA,
        plan: STARTING_PRICE,
        status: "Consultar disponibilidad",
        summary: "Opción práctica para quien quiere asegurar terreno primero y construir más adelante.",
    },
    {
        id: "Lote 03",
        size: LOT_SIZE,
        area: LOT_AREA,
        plan: STARTING_PRICE,
        status: "Disponible",
        summary: "Buena alternativa para compradores remotos que necesitan carpeta digital y seguimiento.",
    },
];

document.addEventListener("DOMContentLoaded", () => {
    initMobileNav();
    initSmoothScroll();
    initFaq();
    renderLots();
    initGoogleMapEmbed();
    initContactCTAs();
    initFinalContactLinks();
    initSupportLinks();
});

function initMobileNav() {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".menu-toggle");

    if (!header || !toggle) {
        return;
    }

    toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        header.classList.toggle("is-nav-open", !expanded);
    });
}

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]:not([data-contact-action])');

    links.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || !targetId.startsWith("#") || targetId.length === 1) {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();
            closeMobileNav();
            scrollToSection(target);
        });
    });
}

function initFaq() {
    const triggers = document.querySelectorAll(".faq-trigger");

    triggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
            const expanded = trigger.getAttribute("aria-expanded") === "true";
            const panelId = trigger.getAttribute("aria-controls");
            const panel = panelId ? document.getElementById(panelId) : null;

            if (!panel) {
                return;
            }

            trigger.setAttribute("aria-expanded", String(!expanded));
            panel.hidden = expanded;
        });
    });
}

function initContactCTAs() {
    const buttons = document.querySelectorAll("[data-contact-action]");

    buttons.forEach((button) => {
        button.setAttribute("href", "#contacto");
        button.addEventListener("click", (event) => {
            event.preventDefault();
            closeMobileNav();
            scrollToContact();
        });
    });
}

function scrollToContact() {
    const contactSection = document.getElementById("contacto");

    if (!contactSection) {
        return;
    }

    scrollToSection(contactSection);
}

function initFinalContactLinks() {
    const whatsappLinks = document.querySelectorAll("[data-whatsapp-final]");
    const emailLinks = document.querySelectorAll("[data-email-final]");

    whatsappLinks.forEach((link) => {
        link.setAttribute("href", createWhatsAppUrl(WHATSAPP_MESSAGE));
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
    });

    emailLinks.forEach((link) => {
        link.setAttribute("href", createEmailUrl());
    });
}

function initGoogleMapEmbed() {
    const mapContainer = document.querySelector("[data-map-embed]");
    const status = document.querySelector("[data-map-status]");

    if (!mapContainer) {
        return;
    }

    if (!GOOGLE_MAPS_EMBED_URL || GOOGLE_MAPS_EMBED_URL.includes("PEGAR_AQUI")) {
        mapContainer.innerHTML = `
            <div class="map-placeholder">
                <div>
                    <strong>Mapa no configurado</strong>
                    <p>Si el mapa no está disponible, abrí la ubicación en Google Maps.</p>
                </div>
            </div>
        `;

        if (status) {
            status.textContent = "Si el mapa no está configurado, abrí la ubicación en Google Maps.";
        }

        return;
    }

    mapContainer.innerHTML = `
        <iframe
            src="${GOOGLE_MAPS_EMBED_URL}"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
            title="Mapa de ubicación de Éden Loteamiento en Tomás Romero Pereira / María Auxiliadora"
        ></iframe>
    `;

    if (status) {
        status.textContent = "Si el mapa no carga, abrí la ubicación en Google Maps.";
    }
}

function renderLots() {
    const grid = document.getElementById("lots-grid");

    if (!grid) {
        return;
    }

    grid.innerHTML = LOTES.map((lot) => {
        const statusClass = lot.status.toLowerCase().includes("consultar") ? "is-consultar" : "";

        return `
            <article class="card lot-card">
                <div class="lot-top">
                    <span class="lot-pill">${escapeHtml(lot.id)}</span>
                    <span class="lot-status ${statusClass}">${escapeHtml(lot.status)}</span>
                </div>
                <h3>${escapeHtml(lot.id)}</h3>
                <p class="card-text">${escapeHtml(lot.summary)}</p>
                <div class="lot-features">
                    <div class="lot-feature"><span>Lote tipo</span><strong>${escapeHtml(lot.size)}</strong></div>
                    <div class="lot-feature"><span>Superficie</span><strong>${escapeHtml(lot.area)}</strong></div>
                    <div class="lot-feature"><span>Plan desde</span><strong>${escapeHtml(lot.plan)}</strong></div>
                    <div class="lot-feature"><span>Estado</span><strong>${escapeHtml(lot.status)}</strong></div>
                </div>
                <div class="lot-actions">
                    <a class="btn btn-primary btn-contact" href="#contacto" data-contact-action>
                        <span class="icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24"><use href="#icon-chat"></use></svg>
                        </span>
                        <span>Consultar</span>
                    </a>
                    <a class="btn btn-secondary btn-contact" href="#contacto" data-contact-action>
                        <span class="icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24"><use href="#icon-folder"></use></svg>
                        </span>
                        <span>Carpeta digital</span>
                    </a>
                </div>
            </article>
        `;
    }).join("");
}

function initSupportLinks() {
    const mapsLinks = document.querySelectorAll(".js-maps-link");

    mapsLinks.forEach((link) => {
        link.setAttribute("href", GOOGLE_MAPS_SHARE_URL);
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
    });
}

function createWhatsAppUrl(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function createEmailUrl() {
    const params = new URLSearchParams({
        subject: EMAIL_SUBJECT,
        body: EMAIL_BODY,
    });

    return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
}

function scrollToSection(target) {
    const header = document.querySelector(".site-header");
    const headerHeight = header ? header.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

    window.scrollTo({
        top,
        behavior: "smooth",
    });

    if (window.history && typeof window.history.pushState === "function" && target.id) {
        window.history.pushState(null, "", `#${target.id}`);
    }
}

function closeMobileNav() {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".menu-toggle");

    if (!header || !toggle) {
        return;
    }

    header.classList.remove("is-nav-open");
    toggle.setAttribute("aria-expanded", "false");
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
