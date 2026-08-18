function normalizeYggdraTechServicesApiUrl(value) {
  return String(
    value || "http://localhost:3333"
  ).replace(/\/+$/, "");
}

function getYggdraTechServiceAssetUrl(
  apiUrl,
  path
) {
  if (!path) {
    return "";
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${apiUrl}/${path.replace(/^\/+/, "")}`;
}

function createYggdraTechServiceCard(
  service,
  apiUrl,
  index
) {
  const article = document.createElement("article");
  article.className = "yggdratech-service-card";

  const media = document.createElement("div");
  media.className = "yggdratech-service-media";

  if (service.imageUrl) {
    const image = document.createElement("img");

    image.src = getYggdraTechServiceAssetUrl(
      apiUrl,
      service.imageUrl
    );

    image.alt =
      service.title
        ? `Imagem do serviço ${service.title}`
        : "Imagem do serviço";

    image.loading = index === 0 ? "eager" : "lazy";

    media.appendChild(image);
  } else {
    const fallback = document.createElement("div");
    fallback.className =
      "yggdratech-service-media-fallback";

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-code";

    fallback.appendChild(icon);
    media.appendChild(fallback);
  }

  const body = document.createElement("div");
  body.className = "yggdratech-service-body";

  const number = document.createElement("span");
  number.className = "yggdratech-service-number";
  number.textContent = String(index + 1).padStart(
    2,
    "0"
  );

  const title = document.createElement("h2");
  title.textContent =
    service.title || "Serviço YggdraTech";

  const description = document.createElement("p");
  description.className =
    "yggdratech-service-description";

  description.textContent =
    service.description || "";

  const offerWrapper =
    document.createElement("div");

  offerWrapper.className =
    "yggdratech-service-offer";

  const offerTitle =
    document.createElement("strong");

  offerTitle.textContent = "O que este serviço oferece";

  const offer = document.createElement("p");
  offer.textContent = service.offer || "";

  offerWrapper.append(
    offerTitle,
    offer
  );

  body.append(
    number,
    title,
    description,
    offerWrapper
  );

  if (service.link) {
    const link = document.createElement("a");

    link.className =
      "yggdratech-service-link";

    link.href = service.link;
    link.textContent = "Conhecer serviço";

    if (
      service.link.startsWith("http://") ||
      service.link.startsWith("https://")
    ) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    const icon = document.createElement("i");
    icon.className =
      "fa-solid fa-arrow-up-right-from-square";

    link.appendChild(icon);
    body.appendChild(link);
  }

  article.append(
    media,
    body
  );

  return article;
}

async function loadYggdraTechServices() {
  const title =
    document.getElementById(
      "services-page-title"
    );

  const message =
    document.getElementById(
      "services-page-message"
    );

  const grid =
    document.getElementById(
      "services-grid"
    );

  const loading =
    document.getElementById(
      "services-loading"
    );

  const errorBox =
    document.getElementById(
      "services-error"
    );

  if (
    !title ||
    !message ||
    !grid ||
    !loading ||
    !errorBox
  ) {
    return;
  }

  try {
    const configResponse = await fetch(
      "/api/config",
      {
        cache: "no-store",
      }
    );

    if (!configResponse.ok) {
      throw new Error(
        "Não foi possível carregar a configuração do site."
      );
    }

    const config =
      await configResponse.json();

    const apiUrl =
      normalizeYggdraTechServicesApiUrl(
        config.yggdraflowApiUrl
      );

    const response = await fetch(
      `${apiUrl}/public/yggdratech/services`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          "Os serviços da YggdraTech ainda não estão publicados."
        );
      }

      throw new Error(
        "Não foi possível carregar os serviços da YggdraTech."
      );
    }

    const result = await response.json();
    const content = result.content || {};

    const services =
      Array.isArray(content.services)
        ? [...content.services].sort(
            (a, b) =>
              Number(a.order || 0) -
              Number(b.order || 0)
          )
        : [];

    title.textContent =
      content.pageTitle || "Serviços YggdraTech";

    message.textContent =
      content.pageMessage || "";

    grid.replaceChildren();

    services.forEach(
      (service, index) => {
        grid.appendChild(
          createYggdraTechServiceCard(
            service,
            apiUrl,
            index
          )
        );
      }
    );

    loading.hidden = true;
    errorBox.hidden = true;

    if (services.length === 0) {
      loading.textContent =
        "Nenhum serviço publicado no momento.";

      loading.hidden = false;
    }
  } catch (error) {
    console.error(
      "Erro ao carregar Serviços:",
      error
    );

    loading.hidden = true;

    errorBox.textContent =
      error instanceof Error
        ? error.message
        : "Não foi possível carregar os serviços.";

    errorBox.hidden = false;
  }
}

document.addEventListener(
  "DOMContentLoaded",
  loadYggdraTechServices
);
