function setHomeMultilineText(element, value) {
  if (!element || typeof value !== "string") {
    return;
  }

  element.textContent = value;
  element.style.whiteSpace = "pre-line";
}

function setHomeText(id, value) {
  const element = document.getElementById(id);

  if (!element || typeof value !== "string") {
    return;
  }

  element.textContent = value;
}

function initHomeBlockReveal() {
  const elements = Array.from(
    document.querySelectorAll("[data-home-reveal]")
  );

  if (!elements.length) {
    return;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) {
    elements.forEach((element) => {
      element.classList.add(
        "home-reveal-content-visible"
      );
    });

    return;
  }

  elements.forEach((element) => {
    const color =
      element.getAttribute(
        "data-home-reveal-color"
      ) || "#12b8d6";

    element.style.setProperty(
      "--home-reveal-color",
      color
    );

    element.classList.add(
      "home-reveal-pending"
    );
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const element = entry.target;

        if (
          element.classList.contains(
            "home-reveal-running"
          )
        ) {
          observer.unobserve(element);
          return;
        }

        const delay = Number(
          element.getAttribute(
            "data-home-reveal-delay"
          ) || 0
        );

        window.setTimeout(() => {
          element.classList.add(
            "home-reveal-running"
          );

          window.setTimeout(() => {
            element.classList.remove(
              "home-reveal-pending"
            );

            element.classList.add(
              "home-reveal-content-visible"
            );
          }, 430);
        }, delay);

        observer.unobserve(element);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -18% 0px",
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
}

async function loadYggdraTechHome() {
  try {
    const configResponse = await fetch("/api/config", {
      cache: "no-store",
    });

    if (!configResponse.ok) {
      throw new Error(
        `Falha ao carregar configuração: ${configResponse.status}`
      );
    }

    const config = await configResponse.json();

    const apiUrl = String(
      config.yggdraflowApiUrl || "http://localhost:3333"
    ).replace(/\/+$/, "");

    const response = await fetch(
      `${apiUrl}/public/yggdratech/home`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Falha ao carregar Home: ${response.status}`
      );
    }

    const data = await response.json();
    const content = data.content;

    if (!content) {
      return;
    }

    setHomeText(
      "home-flow-badge",
      content.hero?.badge
    );

    setHomeMultilineText(
      document.getElementById("home-flow-title"),
      content.hero?.title
    );

    setHomeText(
      "home-flow-highlight",
      content.hero?.highlight
    );

    setHomeText(
      "home-flow-description",
      content.hero?.description
    );

    setHomeText(
      "home-flow-explore-label",
      content.hero?.exploreLabel
    );

    const exploreLink =
      document.getElementById("home-flow-explore");

    if (
      exploreLink &&
      content.hero?.exploreHref
    ) {
      exploreLink.setAttribute(
        "href",
        content.hero.exploreHref
      );
    }

    setHomeText(
      "home-clarity-kicker",
      content.clarity?.kicker
    );

    setHomeMultilineText(
      document.getElementById("home-clarity-title"),
      content.clarity?.title
    );

    setHomeText(
      "home-clarity-description",
      content.clarity?.description
    );

    setHomeText(
      "home-information-kicker",
      content.information?.kicker
    );

    setHomeMultilineText(
      document.getElementById("home-information-title"),
      content.information?.title
    );

    setHomeText(
      "home-information-description",
      content.information?.description
    );

    setHomeMultilineText(
      document.getElementById("home-final-title"),
      content.finalCta?.title
    );

    setHomeText(
      "home-final-description",
      content.finalCta?.description
    );

    setHomeText(
      "home-final-button-label",
      content.finalCta?.buttonLabel
    );

    const finalButton =
      document.getElementById("home-final-button");

    if (
      finalButton &&
      content.finalCta?.buttonHref
    ) {
      finalButton.setAttribute(
        "data-yggdraflow-path",
        content.finalCta.buttonHref
      );
    }

    setHomeText(
      "home-social-title",
      content.social?.title
    );

    if (Array.isArray(content.social?.links)) {
      const socialLinks = {
        instagram:
          document.querySelector(".socialContainer.containerOne"),
        x:
          document.querySelector(".socialContainer.containerTwo"),
        linkedin:
          document.querySelector(".socialContainer.containerThree"),
        email:
          document.querySelector(".socialContainer.containerFour"),
      };

      content.social.links.forEach((link) => {
        const element = socialLinks[link.platform];

        if (!element || !link.url) {
          return;
        }

        element.setAttribute("href", link.url);

        if (link.label) {
          element.setAttribute(
            "aria-label",
            link.label
          );
        }
      });
    }

    setHomeText(
      "home-footer-text",
      content.footerText
    );

    setHomeText(
      "home-chatbot-title",
      content.chatbot?.title
    );

    const chatbotInput =
      document.querySelector(
        "[data-home-chatbot-placeholder]"
      );

    if (
      chatbotInput &&
      content.chatbot?.placeholder
    ) {
      chatbotInput.setAttribute(
        "placeholder",
        content.chatbot.placeholder
      );
    }
  } catch (error) {
    console.error(
      "Erro ao carregar conteúdo dinâmico da Home:",
      error
    );
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  await loadYggdraTechHome();
  initHomeBlockReveal();
});
