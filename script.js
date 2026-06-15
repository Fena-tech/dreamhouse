const defaultSettings = {
  phone: "+267 71 234 567",
  email: "hello@dreamhomesbw.com",
  social: "Instagram @dreamhomesbw",
  theme: "gold"
};

const defaultProperties = [
  {
    id: 1,
    title: "Savannah Ridge Villa",
    price: "P 4,250,000",
    location: "Gaborone, Botswana",
    type: "Luxury Villa",
    image:
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1400&q=80",
    description:
      "A sculptural five-bedroom villa created for elevated privacy and striking modern living. Every room opens to a landscaped courtyard and panoramic views that balance elegance with comfort.",
    features: [
      "Five en-suite bedrooms",
      "Infinity-edge pool and cabana",
      "Smart home automation",
      "Solar-ready roof and backup power"
    ],
    status: "Available"
  },
  {
    id: 2,
    title: "Oceanview Residence",
    price: "P 5,180,000",
    location: "Maun, Botswana",
    type: "Waterfront Home",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80",
    description:
      "Designed for graceful indoor-outdoor living, this waterfront residence celebrates open-plan interiors, refined textures, and exceptional natural light.",
    features: [
      "Panoramic terrace lounge",
      "Private dock access",
      "Three-car garage",
      "Integrated solar energy system"
    ],
    status: "Under Offer"
  },
  {
    id: 3,
    title: "The Forest Retreat",
    price: "P 3,950,000",
    location: "Phakalane, Botswana",
    type: "Contemporary Retreat",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
    description:
      "An expansive retreat wrapped in natural tones and calm architecture, ideal for restorative living and privacy just beyond the city.",
    features: [
      "Spa-style wellness suite",
      "Outdoor dining pavilion",
      "Bespoke cabinetry",
      "Rainwater harvesting"
    ],
    status: "Available"
  },
  {
    id: 4,
    title: "Cobalt Residence",
    price: "P 6,100,000",
    location: "Gaborone, Botswana",
    type: "Penthouse Residence",
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1400&q=80",
    description:
      "A statement penthouse residence pairing polished interiors with skyline views and sculpted outdoor terraces for luxurious entertaining.",
    features: [
      "Rooftop lounge",
      "Designer kitchen",
      "Home cinema",
      "High-efficiency climate control"
    ],
    status: "Sold"
  }
];

const fallbackImage =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900">
      <rect width="100%" height="100%" fill="#071320" />
      <rect x="70" y="70" width="1260" height="760" rx="36" fill="#0f233c" />
      <path d="M240 610 L440 370 L600 530 L760 280 L1080 610 Z" fill="#5cc8ff" fill-opacity="0.8" />
      <text x="700" y="730" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="44" fill="#f5f7ff">DreamHomes Botswana</text>
    </svg>
  `);

function normalizeImageSource(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return fallbackImage;
  if (/^(https?:\/\/|data:|blob:)/i.test(trimmed)) return trimmed;
  return trimmed;
}

let properties = [];

function loadProperties() {
  try {
    const stored = localStorage.getItem("dreamhomesProperties");
    if (!stored) return defaultProperties;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : defaultProperties;
  } catch (error) {
    console.warn("Could not load listings", error);
    return defaultProperties;
  }
}

function saveProperties() {
  localStorage.setItem("dreamhomesProperties", JSON.stringify(properties));
}

function loadSettings() {
  try {
    const stored = localStorage.getItem("dreamhomesSettings");
    if (!stored) return defaultSettings;
    const parsed = JSON.parse(stored);
    return { ...defaultSettings, ...parsed, theme: defaultSettings.theme };
  } catch (error) {
    console.warn("Could not load settings", error);
    return defaultSettings;
  }
}

function saveSettings(settings) {
  localStorage.setItem("dreamhomesSettings", JSON.stringify(settings));
}

let settings = loadSettings();
properties = loadProperties();

function getPropertyFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const propertyId = Number(params.get("property"));
  return properties.find((property) => property.id === propertyId) || properties[0];
}

function renderListings() {
  const cards = document.querySelectorAll(".property-card");
  if (!cards.length) return;

  cards.forEach((card) => card.remove());

  const grid = document.querySelector(".property-grid");
  if (!grid) return;

  properties.forEach((property, index) => {
    const card = document.createElement("a");
    card.className = "property-card fade-up";
    card.href = `details.html?property=${property.id}`;
    const imageSrc = normalizeImageSource(property.image);
    card.innerHTML = `
      <img src="${imageSrc}" alt="${property.title}" />
      <div class="card-content">
        <div class="card-top">
          <span class="tag">${property.type}</span>
          <span class="price">${property.price}</span>
        </div>
        <span class="tag status-badge">${property.status || "Available"}</span>
        <h3>${property.title}</h3>
        <p class="location">${property.location}</p>
        <p class="summary">${property.description}</p>
      </div>
    `;
    const cardImage = card.querySelector("img");
    if (cardImage) {
      cardImage.onerror = () => {
        cardImage.src = fallbackImage;
        cardImage.onerror = null;
      };
    }

    if (index === 0) card.classList.add("fade-up");
    grid.appendChild(card);
  });
}

function renderPropertyDetails() {
  const page = document.body.classList.contains("detail-page");
  if (!page) return;

  const property = getPropertyFromUrl();
  const title = document.getElementById("detailTitle");
  const location = document.getElementById("detailLocation");
  const price = document.getElementById("detailPrice");
  const locationText = document.getElementById("detailLocationText");
  const type = document.getElementById("detailType");
  const description = document.getElementById("detailDescription");
  const image = document.getElementById("detailImage");
  const featureList = document.getElementById("featureList");
  const bookButton = document.getElementById("bookButton");
  const inquiryButton = document.getElementById("inquiryButton");

  if (!title || !location || !price || !locationText || !type || !description || !image || !featureList) return;

  title.textContent = property.title;
  location.textContent = property.location;
  price.textContent = property.price;
  const statusLabel = document.getElementById("detailStatus");
  if (statusLabel) {
    statusLabel.textContent = property.status || "Available";
  }
  locationText.textContent = property.location;
  type.textContent = property.type;
  description.textContent = property.description;
  image.src = normalizeImageSource(property.image);
  image.alt = property.title;
  image.onerror = () => {
    image.src = fallbackImage;
    image.onerror = null;
  };

  featureList.innerHTML = property.features.map((feature) => `<li>${feature}</li>`).join("");

  bookButton.href = "contact.html";
  inquiryButton.href = "contact.html";
  bookButton.textContent = "Contact Us";
  inquiryButton.textContent = "Request Details";
}

function handleBookingForm() {
  const form = document.getElementById("inquiryForm");
  const message = document.getElementById("formMessage");
  const note = document.getElementById("selectedPropertyNote");
  if (!form || !message) return;

  const params = new URLSearchParams(window.location.search);
  const property = properties.find((item) => item.id === Number(params.get("property")));

  if (note && property) {
    note.textContent = `Interested in ${property.title} • ${property.location}`;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    message.textContent = "Thank you. Your inquiry has been received, and a DreamHomes specialist will reach out shortly.";
    form.reset();
  });
}

function openAdminPrompt({ title, description, defaultValue, onSubmit }) {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";

  const card = document.createElement("div");
  card.className = "modal-card";

  const heading = document.createElement("h3");
  heading.textContent = title;

  const paragraph = document.createElement("p");
  paragraph.textContent = description;

  const input = document.createElement("input");
  input.type = "text";
  input.value = defaultValue || "";

  const actions = document.createElement("div");
  actions.className = "modal-actions";

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className = "btn btn-secondary";
  cancelButton.textContent = "Cancel";

  const confirmButton = document.createElement("button");
  confirmButton.type = "button";
  confirmButton.className = "btn btn-primary";
  confirmButton.textContent = "Save";

  const closeModal = () => backdrop.remove();
  cancelButton.addEventListener("click", closeModal);
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) closeModal();
  });

  confirmButton.addEventListener("click", () => {
    const value = input.value.trim();
    closeModal();
    onSubmit(value);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      confirmButton.click();
    }
  });

  actions.append(cancelButton, confirmButton);
  card.append(heading, paragraph, input, actions);
  backdrop.appendChild(card);
  document.body.appendChild(backdrop);
  input.focus();
  input.select();
}

function renderAdminListings() {
  const container = document.getElementById("adminListings");
  if (!container) return;

  container.innerHTML = properties
    .map(
      (property) => `
        <article class="admin-item">
          <div>
            <h3>${property.title}</h3>
            <p>${property.location} • ${property.price}</p>
            <p>Status: ${property.status || "Available"}</p>
          </div>
          <div class="admin-actions">
            <button class="btn btn-secondary" data-action="status" data-id="${property.id}">Change Status</button>
            <button class="btn btn-secondary" data-action="price" data-id="${property.id}">Change Price</button>
            <button class="btn btn-secondary" data-action="remove" data-id="${property.id}">Remove</button>
          </div>
        </article>
      `
    )
    .join("");

  container.querySelectorAll("button[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.getAttribute("data-id"));
      const action = button.getAttribute("data-action");
      if (action === "remove") {
        properties = properties.filter((item) => item.id !== id);
        saveProperties();
        renderAdminListings();
        renderListings();
        renderPropertyDetails();
        const message = document.getElementById("adminMessage");
        if (message) message.textContent = "Listing removed.";
      } else if (action === "status") {
        const property = properties.find((item) => item.id === id);
        openAdminPrompt({
          title: "Update Status",
          description: "Enter the new status for this listing.",
          defaultValue: property?.status || "Available",
          onSubmit: (nextStatus) => {
            if (!nextStatus) return;
            property.status = nextStatus;
            saveProperties();
            renderAdminListings();
            renderListings();
            renderPropertyDetails();
            const message = document.getElementById("adminMessage");
            if (message) message.textContent = "Status updated.";
          }
        });
      } else if (action === "price") {
        const property = properties.find((item) => item.id === id);
        openAdminPrompt({
          title: "Update Price",
          description: "Enter the new price for this listing.",
          defaultValue: property?.price || "",
          onSubmit: (nextPrice) => {
            if (!nextPrice) return;
            property.price = nextPrice;
            saveProperties();
            renderAdminListings();
            renderListings();
            renderPropertyDetails();
            const message = document.getElementById("adminMessage");
            if (message) message.textContent = "Price updated.";
          }
        });
      }
    });
  });
}

function handleAdminAccess() {
  const loginCard = document.getElementById("adminLoginCard");
  const protectedContent = document.getElementById("adminProtectedContent");
  const loginForm = document.getElementById("adminLoginForm");
  const loginMessage = document.getElementById("loginMessage");

  if (!loginCard || !protectedContent || !loginForm) return;

  const isAuthorized = sessionStorage.getItem("dreamhomesAdmin") === "true";
  if (isAuthorized) {
    loginCard.hidden = true;
    protectedContent.hidden = false;
    return;
  }

  protectedContent.hidden = true;
  loginCard.hidden = false;

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const password = document.getElementById("adminPassword");
    if (!password) return;

    if (password.value === "owner2026") {
      sessionStorage.setItem("dreamhomesAdmin", "true");
      loginCard.hidden = true;
      protectedContent.hidden = false;
      loginMessage.textContent = "Access granted.";
    } else {
      loginMessage.textContent = "Incorrect password. Please try again.";
    }
  });
}

function handleAddListing() {
  const form = document.getElementById("addListingForm");
  const message = document.getElementById("adminMessage");
  const imageUpload = document.getElementById("imageUpload");
  const imageUrlField = document.getElementById("imageUrlField");
  if (!form || !message || !imageUpload || !imageUrlField) return;

  imageUpload.addEventListener("change", () => {
    const file = imageUpload.files && imageUpload.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      imageUrlField.value = typeof reader.result === "string" ? reader.result : "";
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const newProperty = {
      id: Date.now(),
      title: String(formData.get("title") || "").trim(),
      price: String(formData.get("price") || "").trim(),
      location: String(formData.get("location") || "").trim(),
      type: String(formData.get("type") || "").trim(),
      image: normalizeImageSource(String(formData.get("image") || "").trim()),
      description: String(formData.get("description") || "A beautifully curated property waiting for its next owner.").trim(),
      features: ["New addition", "Premium finish", "Luxury comfort"],
      status: String(formData.get("status") || "Available").trim()
    };

    properties.unshift(newProperty);
    saveProperties();
    form.reset();
    imageUrlField.value = "";
    renderAdminListings();
    renderListings();
    renderPropertyDetails();
    message.textContent = "New listing added successfully.";
  });
}

function applyTheme() {
  document.body.classList.remove("theme-gold");
  if (settings.theme === "gold") {
    document.body.classList.add("theme-gold");
  }
}

function renderContactPage() {
  const phone = document.getElementById("contactPhone");
  const email = document.getElementById("contactEmail");
  const social = document.getElementById("contactSocial");

  if (phone) phone.textContent = settings.phone;
  if (email) email.textContent = settings.email;
  if (social) social.textContent = settings.social;
}

function handleSiteSettings() {
  const form = document.getElementById("siteSettingsForm");
  const message = document.getElementById("settingsMessage");
  const phoneInput = document.getElementById("sitePhoneInput");
  const emailInput = document.getElementById("siteEmailInput");
  const socialInput = document.getElementById("siteSocialInput");
  const themeInput = document.getElementById("siteThemeInput");
  if (!form || !message || !phoneInput || !emailInput || !socialInput || !themeInput) return;

  phoneInput.value = settings.phone;
  emailInput.value = settings.email;
  socialInput.value = settings.social;
  themeInput.value = settings.theme;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    settings = {
      phone: phoneInput.value.trim() || defaultSettings.phone,
      email: emailInput.value.trim() || defaultSettings.email,
      social: socialInput.value.trim() || defaultSettings.social,
      theme: themeInput.value || defaultSettings.theme
    };
    saveSettings(settings);
    applyTheme();
    renderContactPage();
    message.textContent = "Settings updated.";
  });
}

function initializeNavigation() {
  const links = Array.from(document.querySelectorAll(".nav-links a"));
  const current = window.location.pathname.split("/").pop() || "index.html";

  links.forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (href === current || (current === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("storage", (event) => {
  if (event.key === "dreamhomesProperties") {
    properties = loadProperties();
    renderListings();
    renderPropertyDetails();
    renderAdminListings();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  initializeNavigation();
  renderListings();
  renderPropertyDetails();
  handleBookingForm();
  handleAdminAccess();
  renderAdminListings();
  handleAddListing();
  handleSiteSettings();
  renderContactPage();
});
