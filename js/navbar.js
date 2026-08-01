async function loadNavbar() {
  const navbarContainer = document.getElementById("navbar-container");

  if (!navbarContainer) return;

  let navbarPath = "";

  if (window.location.pathname.includes("/pages/")) {
    navbarPath = "../components/navbar.html";
  } else {
    navbarPath = "./components/navbar.html";
  }

  try {
    const response = await fetch(navbarPath);
    const html = await response.text();

    navbarContainer.innerHTML = html;

    initMobileNavbar();

  } catch (error) {
    console.error("Erro ao carregar navbar:", error);
  }
}

function initMobileNavbar() {
  const hamburgerButton = document.querySelector(".hamburger-menu");
  const mainNav = document.getElementById("main-nav");
  const navOverlay = document.querySelector(".nav-overlay");
  const navLinks = document.querySelectorAll("#main-nav a");
  const body = document.body;

  if (!hamburgerButton || !mainNav) return;

  function toggleMenu() {
    mainNav.classList.toggle("active");

    if (navOverlay) {
      navOverlay.classList.toggle("active");
    }

    body.classList.toggle("no-scroll");
  }

  hamburgerButton.addEventListener("click", toggleMenu);

  if (navOverlay) {
    navOverlay.addEventListener("click", toggleMenu);
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