
const profileBtn = document.getElementById("profileBtn");
const profileMenu = document.getElementById("profileMenu");
const searchForm = document.getElementById("searchForm");
const siteSearch = document.getElementById("siteSearch");
const notificationBtn = document.getElementById("notificationBtn");

//Under Development Section
document.getElementById("projects").addEventListener("click", function () {
    alert("This panel is still under development.");
});

document.getElementById("other_resources").addEventListener("click", function () {
    alert("This panel is still under development.");
});


// Toggle profile dropdown
profileBtn.addEventListener("click", () => {
    const isExpanded =
        profileBtn.getAttribute("aria-expanded") === "true";

    profileBtn.setAttribute("aria-expanded", String(!isExpanded));
    profileMenu.hidden = isExpanded;
});

// Close dropdown when clicking outside it
document.addEventListener("click", (event) => {
    if (!event.target.closest(".user-controls")) {
        profileMenu.hidden = true;
        profileBtn.setAttribute("aria-expanded", "false");
    }
});

// Temporary search behavior
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = siteSearch.value.trim();

    if (!query) {
        siteSearch.focus();
        return;
    }

    alert(`Search functionality will be connected later.\nSearch term: ${query}`);
});

// Temporary notification behavior
notificationBtn.addEventListener("click", () => {
    alert("Your notifications panel will be added later.");
});


/* ========================================
   SIDEBAR FUNCTIONALITY
======================================== */

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const sidebarClose = document.getElementById("sidebarClose");
const sidebarOverlay = document.getElementById("sidebarOverlay");

function openSidebar() {
    sidebar.classList.add("open");
    sidebarOverlay.classList.add("show");

    menuToggle.setAttribute("aria-expanded", "true");
    sidebar.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
}

function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("show");

    menuToggle.setAttribute("aria-expanded", "false");
    sidebar.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
}

menuToggle.addEventListener("click", openSidebar);

sidebarClose.addEventListener("click", closeSidebar);

sidebarOverlay.addEventListener("click", closeSidebar);

// Close using Escape key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeSidebar();
    }
});

// Close after selecting a navigation link
document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.addEventListener("click", closeSidebar);
});


//Hero Section

const heroSearchForm = document.getElementById("heroSearchForm");
const heroSearchInput = document.getElementById("heroSearchInput");
const searchChips = document.querySelectorAll(".search-chip");

// Clicking a popular search fills the search field
searchChips.forEach((chip) => {
    chip.addEventListener("click", () => {
        heroSearchInput.value = chip.dataset.query;
        heroSearchInput.focus();
    });
});

// Temporary hero search behavior
heroSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = heroSearchInput.value.trim();

    if (!query) {
        heroSearchInput.focus();
        return;
    }

    alert(
        `Resource searching will be implemented later.\nSearch term: ${query}`
    );
});


promoBtn.addEventListener("click", () => {
    alert("This anel will be added later.");
});