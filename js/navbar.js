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

    initHomeRestart();
    initEntryMenu();
    initMobileNavbar();
  } catch (error) {
    console.error(
      "Erro ao carregar navbar:",
      error
    );
  }
}

function initHomeRestart() {
  const homeLink =
    document.querySelector(
      "[data-home-restart]"
    );

  if (!homeLink) {
    return;
  }

  homeLink.addEventListener(
    "click",
    (event) => {
      const currentPath =
        window.location.pathname
          .replace(/\/+$/, "");

      const isHome =
        currentPath === "" ||
        currentPath.endsWith(
          "/index.html"
        );

      if (!isHome) {
        return;
      }

      event.preventDefault();

      window.location.reload();
    }
  );
}

function initEntryMenu() {
  const entryMenu =
    document.querySelector(".nav-entry-menu");

  const trigger =
    document.querySelector(".nav-entry-trigger");

  const card =
    document.querySelector(".nav-entry-card");

  if (!entryMenu || !trigger || !card) {
    return;
  }

  function setOpen(isOpen) {
    entryMenu.classList.toggle(
      "active",
      isOpen
    );

    trigger.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    card.setAttribute(
      "aria-hidden",
      String(!isOpen)
    );
  }

  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    setOpen(
      !entryMenu.classList.contains("active")
    );
  });

  card.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  card
    .querySelectorAll("a")
    .forEach((link) => {
      link.addEventListener("click", () => {
        setOpen(false);
      });
    });

  document.addEventListener("click", (event) => {
    if (!entryMenu.contains(event.target)) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
      trigger.focus();
    }
  });
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

  const entryMenu =
    document.querySelector(".nav-entry-menu");

  const entryTrigger =
    document.querySelector(".nav-entry-trigger");

  const entryCard =
    document.querySelector(".nav-entry-card");

  const body = document.body;

  if (!hamburgerButton || !mainNav) {
    return;
  }

  function closeEntryMenu() {
    if (entryMenu) {
      entryMenu.classList.remove("active");
    }

    if (entryTrigger) {
      entryTrigger.setAttribute(
        "aria-expanded",
        "false"
      );
    }

    if (entryCard) {
      entryCard.setAttribute(
        "aria-hidden",
        "true"
      );
    }
  }

  function toggleMenu() {
    const willOpen =
      !mainNav.classList.contains("active");

    mainNav.classList.toggle(
      "active",
      willOpen
    );

    if (navOverlay) {
      navOverlay.classList.toggle(
        "active",
        willOpen
      );
    }

    body.classList.toggle(
      "no-scroll",
      willOpen
    );

    if (!willOpen) {
      closeEntryMenu();
    }
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
