const WHATSAPP_NUMBER = "595XXXXXXXXX"; // Reemplazar por el numero real en formato internacional, sin + ni espacios.
const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/tpnS1MzXkLu2Yi1o7";
const LOT_SIZE = "14 x 40 m";
const LOT_AREA = "560 m";
const STARTING_PRICE = "Gs. 800.000";
const PROJECT_LOCATION_LABEL = "Tomás Romero Pereira / María Auxiliadora, Itapúa";

// Coordenadas reutilizadas del proyecto Django anterior. Cambiarlas solo si confirmas otro punto real.
const MAP_COORDINATES = {
    lat: -26.494759,
    lng: -55.273071,
};

const MAP_ZOOM = 14;
const STORAGE_KEY = "eden_landing_leads";
const LOTES = [
    {
        id: "Lote 01",
        size: LOT_SIZE,
        area: LOT_AREA,
        plan: STARTING_PRICE,
        status: "Disponible",
        summary: "Una opción práctica para primera vivienda con consulta simple y ubicación verificable.",
    },
    {
        id: "Lote 02",
        size: LOT_SIZE,
        area: LOT_AREA,
        plan: STARTING_PRICE,
        status: "Consultar disponibilidad",
        summary: "Pensado para quien quiere empezar con una cuota posible y construir más adelante.",
    },
    {
        id: "Lote 03",
        size: LOT_SIZE,
        area: LOT_AREA,
        plan: STARTING_PRICE,
        status: "Disponible",
        summary: "Buena alternativa para compradores remotos que necesitan carpeta digital y seguimiento.",
    },
    {
        id: "Lote 04",
        size: LOT_SIZE,
        area: LOT_AREA,
        plan: STARTING_PRICE,
        status: "Consultar disponibilidad",
        summary: "Opción para consulta familiar, visita guiada o videollamada antes de avanzar.",
    },
];

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("footer-year").textContent = new Date().getFullYear();
    initSmoothScroll();
    initFaq();
    renderLots();
    initLeadForm();
    initMap();
    initWhatsAppLinks();
});

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || !targetId.startsWith("#") || targetId === "#" || targetId.length === 1) {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const header = document.querySelector(".site-header");
            const headerHeight = header ? header.offsetHeight : 0;
            const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

            window.scrollTo({
                top,
                behavior: "smooth",
            });

            if (window.history && typeof window.history.pushState === "function") {
                window.history.pushState(null, "", targetId);
            }
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

function initLeadForm() {
    const forms = document.querySelectorAll("[data-lead-form]");

    forms.forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (typeof form.reportValidity === "function" && !form.reportValidity()) {
                return;
            }

            const formData = new FormData(form);
            const lead = {
                formName: form.dataset.formName || "general",
                name: getFieldValue(formData, "name"),
                whatsapp: getFieldValue(formData, "whatsapp"),
                city: getFieldValue(formData, "city"),
                profile: getFieldValue(formData, "profile"),
                budget: getFieldValue(formData, "budget"),
                lotInterest: getFieldValue(formData, "lot_interest"),
                message: getFieldValue(formData, "message"),
                utms: getUTMParams(),
                createdAt: new Date().toISOString(),
            };

            saveLeadLocal(lead);

            const whatsappMessage = buildWhatsAppMessage({
                context: "Formulario de consulta",
                lead,
            });

            const status = form.querySelector("[data-form-status]");
            if (status) {
                status.textContent = "Consulta preparada. Se abrió WhatsApp y quedó una copia guardada en este navegador.";
                status.classList.add("is-success");
            }

            window.open(createWhatsAppUrl(whatsappMessage), "_blank", "noopener");
            form.reset();
        });
    });
}

function buildWhatsAppMessage({ context = "Consulta general", lead = null, lot = null } = {}) {
    const lines = [
        "Hola, quiero consultar por terrenos en María Auxiliadora.",
        `Motivo: ${context}`,
        `Ubicación de interés: ${PROJECT_LOCATION_LABEL}`,
        `Lote tipo: ${LOT_SIZE}`,
        `Superficie comunicada: ${LOT_AREA}`,
        `Planes desde: ${STARTING_PRICE}`,
    ];

    if (lot) {
        lines.push(`Lote consultado: ${lot}`);
    }

    if (lead) {
        if (lead.name) {
            lines.push(`Nombre: ${lead.name}`);
        }

        if (lead.whatsapp) {
            lines.push(`WhatsApp: ${lead.whatsapp}`);
        }

        if (lead.city) {
            lines.push(`Ciudad actual: ${lead.city}`);
        }

        if (lead.profile) {
            lines.push(`Perfil: ${lead.profile}`);
        }

        if (lead.budget) {
            lines.push(`Presupuesto mensual: ${lead.budget}`);
        }

        if (lead.lotInterest) {
            lines.push(`Lote de interés: ${lead.lotInterest}`);
        }

        if (lead.message) {
            lines.push(`Mensaje: ${lead.message}`);
        }
    }

    const utms = lead && lead.utms ? lead.utms : getUTMParams();
    const utmEntries = Object.entries(utms);

    if (utmEntries.length > 0) {
        lines.push(`UTMs: ${utmEntries.map(([key, value]) => `${key}=${value}`).join(", ")}`);
    }

    lines.push(`Google Maps: ${GOOGLE_MAPS_URL}`);
    return lines.join("\n");
}

function saveLeadLocal(lead) {
    try {
        const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        current.unshift(lead);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current.slice(0, 50)));
    } catch (error) {
        // Si el navegador bloquea localStorage, no interrumpimos el flujo de consulta.
    }
}

function getUTMParams() {
    const params = new URLSearchParams(window.location.search);
    const utms = {};

    params.forEach((value, key) => {
        if (key.toLowerCase().startsWith("utm_")) {
            utms[key] = value;
        }
    });

    return utms;
}

function initMap() {
    const mapElement = document.getElementById("map");
    const status = document.getElementById("map-status");

    if (!mapElement) {
        return;
    }

    if (typeof window.L === "undefined") {
        if (status) {
            status.textContent = "El mapa interactivo no se cargó. Usa el botón para abrir la ubicación verificada en Google Maps.";
        }
        return;
    }

    try {
        const map = window.L.map(mapElement, {
            scrollWheelZoom: false,
        }).setView([MAP_COORDINATES.lat, MAP_COORDINATES.lng], MAP_ZOOM);

        window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        window.L.marker([MAP_COORDINATES.lat, MAP_COORDINATES.lng])
            .addTo(map)
            .bindPopup(
                `<strong>Edén Loteamiento</strong><br>${PROJECT_LOCATION_LABEL}<br><a href="${GOOGLE_MAPS_URL}" target="_blank" rel="noopener noreferrer">Abrir en Google Maps</a>`
            )
            .openPopup();

        window.addEventListener("resize", () => {
            setTimeout(() => map.invalidateSize(), 120);
        });
    } catch (error) {
        if (status) {
            status.textContent = "No se pudo iniciar el mapa interactivo. Usa el enlace de Google Maps como respaldo.";
        }
    }
}

function renderLots() {
    const grid = document.getElementById("lots-grid");
    const selects = document.querySelectorAll("[data-lots-select]");

    if (!grid) {
        return;
    }

    grid.innerHTML = LOTES.map((lot) => {
        const statusClass = lot.status.toLowerCase().includes("consultar") ? "is-consultar" : "";
        const lotLabel = `${lot.id} ${lot.size} ${lot.area} ${lot.plan}`;
        const message = buildWhatsAppMessage({
            context: `Me interesa el lote 14x40 de 560 m con plan desde Gs. 800.000. Referencia: ${lot.id}.`,
            lot: lotLabel,
        });

        return `
            <article class="lot-card">
                <div class="lot-meta">
                    <span class="lot-badge">${lot.id}</span>
                    <span class="lot-status ${statusClass}">${lot.status}</span>
                </div>
                <h3>${lot.id}</h3>
                <p>${lot.summary}</p>
                <div class="lot-features">
                    <div class="lot-feature"><span>Lote tipo</span><strong>${lot.size}</strong></div>
                    <div class="lot-feature"><span>Superficie</span><strong>${lot.area}</strong></div>
                    <div class="lot-feature"><span>Plan desde</span><strong>${lot.plan}</strong></div>
                    <div class="lot-feature"><span>Estado</span><strong>${lot.status}</strong></div>
                </div>
                <div class="lot-tags">
                    <a class="btn btn-primary" href="${createWhatsAppUrl(message)}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a>
                    <a class="btn btn-secondary js-whatsapp-link" href="#contacto" data-whatsapp-context="Quiero solicitar carpeta digital del ${lot.id}">Solicitar carpeta digital</a>
                </div>
            </article>
        `;
    }).join("");

    selects.forEach((select) => {
        const baseOption = select.querySelector('option[value=""]');
        select.innerHTML = baseOption ? baseOption.outerHTML : '<option value="">Elegir luego</option>';

        LOTES.forEach((lot) => {
            const option = document.createElement("option");
            option.value = `${lot.id} - ${lot.size} - ${lot.area} - ${lot.plan}`;
            option.textContent = `${lot.id} - ${lot.status}`;
            select.appendChild(option);
        });
    });
}

function initWhatsAppLinks() {
    const links = document.querySelectorAll(".js-whatsapp-link");
    const mapsLinks = document.querySelectorAll(".js-maps-link");

    links.forEach((link) => {
        const context = link.dataset.whatsappContext || "Consulta general";
        const message = buildWhatsAppMessage({ context });
        link.setAttribute("href", createWhatsAppUrl(message));
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
    });

    mapsLinks.forEach((link) => {
        link.setAttribute("href", GOOGLE_MAPS_URL);
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
    });
}

function createWhatsAppUrl(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function getFieldValue(formData, fieldName) {
    const value = formData.get(fieldName);
    return typeof value === "string" ? value.trim() : "";
}
