// ================================================================
//  Shared Sidebar + Header component
//  Include this script on every protected page:
//    <script type="module" src="../js/shell.js"></script>
// ================================================================
import { logoutUser } from "./auth.js";
import { clearSession, getSession } from "./utils.js";

const ROUTES = [
  { icon: "📊", label: "Dashboard", href: "dashboard.html", id: "nav-dashboard", roles: ["doctor", "admin"] },
  { icon: "📤", label: "Upload X-Ray", href: "upload.html", id: "nav-upload", roles: ["doctor"] },
  { icon: "📋", label: "My History", href: "history.html", id: "nav-history", roles: ["doctor"] },
  { icon: "🛡️", label: "Admin Panel", href: "admin.html", id: "nav-admin", roles: ["admin"] },
];

export function renderShell(activeId, pageTitle) {
  const user = getSession();
  // No-redirect logic for Guest mode
  if (!user) { window.location.href = "/xray-ai/index.html"; return; }

  const currentPage = window.location.pathname.split("/").pop();

  // ── Sidebar ────────────────────────────────────────────────
  const navItems = ROUTES
    .filter(r => r.roles.includes(user.role))
    .map(r => {
      const isActive = r.href === currentPage ? "active" : "";
      return `
      <button class="nav-item ${isActive}" id="${r.id}" onclick="navigate('${r.href}')">
        <span class="nav-icon">${r.icon}</span>
        ${r.label}
      </button>`;
    })
    .join("");

  const initials = (user.name || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const roleTag = user.role === "admin"
    ? `<span class="tag tag-admin">Admin</span>`
    : `<span class="tag tag-doctor">Chief Medical Officer</span>`;

  const sidebarHTML = `
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-logo">
      <div class="logo-icon">🫁</div>
      <div class="logo-text">
        <h2>X-Ray AI</h2>
        <span>Screening Assistant</span>
      </div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section-label">Navigation</div>
      ${navItems}
    </nav>
    <div class="sidebar-footer">
      <div class="user-pill">
        <div class="user-avatar">${initials}</div>
        <div class="user-info">
          <div class="uname">${user.name}</div>
          <div class="urole">${user.role === "admin" ? "Systems Admin" : "Full Access Protocol"}</div>
        </div>
      </div>
    </div>
  </aside>
  <div class="sidebar-overlay" id="sidebar-overlay"></div>
  <button class="hamburger" id="hamburger">☰</button>`;

  // ── Top bar ────────────────────────────────────────────────
  const topbarHTML = `
  <header class="topbar">
    <span class="topbar-title">${pageTitle}</span>
    <div class="topbar-right">
      <span class="topbar-time" id="topbar-time"></span>
      <div class="topbar-dot"></div>
      ${roleTag}
    </div>
  </header>`;

  // Inject into page
  const shell = document.getElementById("app-shell");
  if (!shell) return;
  shell.innerHTML = sidebarHTML + `<div class="main-content">${topbarHTML}<div class="page-body" id="page-body"></div></div>`;

  // Auto-scroll to top
  window.scrollTo(0, 0);

  // Clock
  function tick() {
    const t = document.getElementById("topbar-time");
    if (t) t.textContent = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }
  tick();
  setInterval(tick, 30000);

  // Hamburger toggle
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  hamburger?.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("visible");
  });
  overlay?.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("visible");
  });
}

// Global navigate helper (used in onclick)
window.navigate = (href) => { window.location.href = href; };
