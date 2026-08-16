function normalizeYggdraTechApiUrl(value) {
  return String(value || "http://localhost:3333").replace(/\/+$/, "");
}

function getYggdraTechAssetUrl(apiUrl, path) {
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

function createAboutMemberCard(member, apiUrl) {
  const article = document.createElement("article");
  article.className = "yggdratech-about-member";

  const photo = document.createElement("div");
  photo.className = "yggdratech-about-member-photo";

  if (member.imageUrl) {
    const image = document.createElement("img");

    image.src = getYggdraTechAssetUrl(
      apiUrl,
      member.imageUrl
    );

    image.alt = `Foto de ${member.name}`;
    image.loading = "lazy";

    photo.appendChild(image);
  } else {
    const fallback = document.createElement("span");
    fallback.textContent =
      String(member.name || "?")
        .trim()
        .charAt(0)
        .toUpperCase();

    photo.appendChild(fallback);
  }

  const body = document.createElement("div");
  body.className = "yggdratech-about-member-body";

  const name = document.createElement("h2");
  name.textContent = member.name;

  const role = document.createElement("p");
  role.className = "yggdratech-about-member-role";
  role.textContent = member.role;

  const shortBio = document.createElement("p");
  shortBio.className = "yggdratech-about-member-summary";
  shortBio.textContent = member.shortBio;

  body.append(name, role, shortBio);
  article.append(photo, body);

  return article;
}

function createBiography(member, apiUrl, index) {
  const article = document.createElement("article");

  article.className = [
    "yggdratech-about-biography",
    index % 2 === 1 ? "is-reverse" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const photo = document.createElement("div");
  photo.className = "yggdratech-about-biography-photo";

  if (member.imageUrl) {
    const image = document.createElement("img");

    image.src = getYggdraTechAssetUrl(
      apiUrl,
      member.imageUrl
    );

    image.alt = `Foto de ${member.name}`;
    image.loading = "lazy";

    photo.appendChild(image);
  }

  const copy = document.createElement("div");
  copy.className = "yggdratech-about-biography-copy";

  const kicker = document.createElement("p");
  kicker.className = "yggdratech-about-kicker";
  kicker.textContent = "NOSSA HISTÓRIA";

  const title = document.createElement("h2");
  title.textContent = member.name;

  const role = document.createElement("p");
  role.className = "yggdratech-about-biography-role";
  role.textContent = member.role;

  const biography = document.createElement("p");
  biography.className = "yggdratech-about-biography-text";
  biography.textContent = member.biography;

  copy.append(
    kicker,
    title,
    role,
    biography
  );

  article.append(photo, copy);

  return article;
}

async function loadYggdraTechAbout() {
  const title =
    document.getElementById("about-title");

  const description =
    document.getElementById("about-description");

  const membersContainer =
    document.getElementById("about-members");

  const biographiesContainer =
    document.getElementById("about-biographies");

  const biographiesSection =
    document.getElementById(
      "about-biographies-section"
    );

  const loading =
    document.getElementById("about-loading");

  const errorBox =
    document.getElementById("about-error");

  if (
    !title ||
    !description ||
    !membersContainer ||
    !biographiesContainer ||
    !biographiesSection ||
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

    const config = await configResponse.json();

    const apiUrl =
      normalizeYggdraTechApiUrl(
        config.yggdraflowApiUrl
      );

    const response = await fetch(
      `${apiUrl}/public/yggdratech/about`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          "O conteúdo Quem Somos ainda não está publicado."
        );
      }

      throw new Error(
        "Não foi possível carregar o Quem Somos."
      );
    }

    const result = await response.json();
    const content = result.content || {};
    const members = Array.isArray(content.members)
      ? [...content.members].sort(
          (a, b) =>
            Number(a.order || 0) -
            Number(b.order || 0)
        )
      : [];

    title.textContent =
      content.title || "Quem Somos";

    description.textContent =
      content.description || "";

    membersContainer.replaceChildren();
    biographiesContainer.replaceChildren();

    members.forEach((member, index) => {
      membersContainer.appendChild(
        createAboutMemberCard(
          member,
          apiUrl
        )
      );

      biographiesContainer.appendChild(
        createBiography(
          member,
          apiUrl,
          index
        )
      );
    });

    loading.hidden = true;
    errorBox.hidden = true;

    biographiesSection.hidden =
      members.length === 0;
  } catch (error) {
    console.error(
      "Erro ao carregar Quem Somos:",
      error
    );

    loading.hidden = true;

    errorBox.textContent =
      error instanceof Error
        ? error.message
        : "Não foi possível carregar o conteúdo.";

    errorBox.hidden = false;
  }
}

document.addEventListener(
  "DOMContentLoaded",
  loadYggdraTechAbout
);
