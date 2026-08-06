const DEFAULT_YGGDRAFLOW_APP_URL = "http://localhost:5173";

function normalizeBaseUrl(value) {
  return String(
    value || DEFAULT_YGGDRAFLOW_APP_URL
  ).replace(/\/+$/, "");
}

async function getYggdraFlowAppUrl() {
  try {
    const response = await fetch("/api/config", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Falha ao carregar configuração: ${response.status}`
      );
    }

    const config = await response.json();

    return normalizeBaseUrl(
      config.yggdraflowAppUrl
    );
  } catch (error) {
    console.warn(
      "Não foi possível carregar a URL do YggdraFlow. Usando endereço local.",
      error
    );

    return DEFAULT_YGGDRAFLOW_APP_URL;
  }
}

function applyYggdraFlowLinks(appUrl) {
  const links = document.querySelectorAll(
    "[data-yggdraflow-path]"
  );

  links.forEach((link) => {
    const path =
      link.getAttribute("data-yggdraflow-path") || "";

    link.setAttribute(
      "href",
      `${appUrl}${path}`
    );
  });
}

async function loadNavbar() {
  const navbarContainer =
    document.getElementById("navbar-container");

  if (!navbarContainer) {
    return;
  }

  const navbarPath =
    window.location.pathname.includes("/pages/")
      ? "../components/navbar.html"
      : "./components/navbar.html";

  try {
    const [
      navbarResponse,
      yggdraFlowAppUrl,
    ] = await Promise.all([
      fetch(navbarPath),
      getYggdraFlowAppUrl(),
    ]);

    if (!navbarResponse.ok) {
      throw new Error(
        `Falha ao carregar navbar: ${navbarResponse.status}`
      );
    }

    navbarContainer.innerHTML =
      await navbarResponse.text();

    applyYggdraFlowLinks(
      yggdraFlowAppUrl
    );

    initMobileNavbar();
  } catch (error) {
    console.error(
      "Erro ao carregar navbar:",
      error
    );
  }
}

function initMobileNavbar() {
  const hamburgerButton =
    document.querySelector(".hamburger-menu");

  const mainNav =
    document.getElementById("main-nav");

  const navOverlay =
    document.querySelector(".nav-overlay");

  const navLinks =
    document.querySelectorAll("#main-nav a");

  const body = document.body;

  if (!hamburgerButton || !mainNav) {
    return;
  }

  function toggleMenu() {
    mainNav.classList.toggle("active");

    if (navOverlay) {
      navOverlay.classList.toggle("active");
    }

    body.classList.toggle("no-scroll");
  }

  hamburgerButton.addEventListener(
    "click",
    toggleMenu
  );

  if (navOverlay) {
    navOverlay.addEventListener(
      "click",
      toggleMenu
    );
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (mainNav.classList.contains("active")) {
        toggleMenu();
      }
    });
  });
}

loadNavbar();
