(() => {
  const canvas = document.getElementById("yggdra-particle-text");
  const copyWrap = document.getElementById("yggdra-hero-copy");
  const titleEl = document.getElementById("yggdra-hero-title");
  const descriptionEl = document.getElementById("yggdra-hero-description");

  if (!canvas || !copyWrap || !titleEl || !descriptionEl) {
    return;
  }

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return;
  }

  const scenes = [
    {
      type: "particle",
      duration: 3000 
    },
    {
      type: "title",
      duration: 3400
    },
    {
      type: "description",
      duration: 4200
    }
  ];

  const particles = [];

  let sceneIndex = 0;
  let nextChangeAt = 0;
  let animationFrame = null;
  let resizeTimer = null;

  let width = 1000;
  let height = 350;

  const pixelStep = 5;

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;

      this.tx = x;
      this.ty = y;

      this.vx = 0;
      this.vy = 0;

      this.alpha = 1;
      this.targetAlpha = 1;

      this.color = "#081120";
    }

    update() {
      const dx = this.tx - this.x;
      const dy = this.ty - this.y;

      this.vx += dx * 0.025;
      this.vy += dy * 0.025;

      this.vx *= 0.82;
      this.vy *= 0.82;

      this.x += this.vx;
      this.y += this.vy;

      this.alpha +=
        (this.targetAlpha - this.alpha) * 0.08;
    }

    draw() {
      if (this.alpha <= 0.01) {
        return;
      }

      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;

      ctx.fillRect(
        this.x,
        this.y,
        2.2,
        2.2
      );
    }
  }

  function randomOutsidePoint() {
    const angle =
      Math.random() * Math.PI * 2;

    const distance =
      Math.max(width, height) * 0.7;

    return {
      x:
        width / 2 +
        Math.cos(angle) * distance,

      y:
        height / 2 +
        Math.sin(angle) * distance
    };
  }

  function shuffle(array) {
    for (
      let i = array.length - 1;
      i > 0;
      i--
    ) {
      const j =
        Math.floor(
          Math.random() * (i + 1)
        );

      [array[i], array[j]] =
        [array[j], array[i]];
    }
  }

  function createHelloTargets() {
    const buffer =
      document.createElement("canvas");

    buffer.width = width;
    buffer.height = height;

    const bufferCtx =
      buffer.getContext("2d");

    if (!bufferCtx) {
      return [];
    }

    const fontSize =
      window.innerWidth <= 768
        ? 76
        : 96;

    bufferCtx.clearRect(
      0,
      0,
      width,
      height
    );

    bufferCtx.fillStyle = "#ffffff";

    bufferCtx.font =
      `700 ${fontSize}px Inter, Arial, sans-serif`;

    bufferCtx.textAlign = "center";
    bufferCtx.textBaseline = "middle";

    bufferCtx.fillText(
      "Olá.",
      width / 2,
      height / 2
    );

    const image =
      bufferCtx.getImageData(
        0,
        0,
        width,
        height
      );

    const targets = [];

    for (
      let y = 0;
      y < height;
      y += pixelStep
    ) {
      for (
        let x = 0;
        x < width;
        x += pixelStep
      ) {
        const index =
          (y * width + x) * 4;

        if (
          image.data[index + 3] > 100
        ) {
          targets.push({
            x,
            y
          });
        }
      }
    }

    return targets;
  }

  function hideCopy() {
    copyWrap.classList.add("is-hidden");

    titleEl.classList.add("is-hidden");
    descriptionEl.classList.add("is-hidden");
  }

  function scatterParticles() {
    particles.forEach((particle) => {
      const target =
        randomOutsidePoint();

      particle.tx = target.x;
      particle.ty = target.y;
      particle.targetAlpha = 0;
    });
  }

  function showHello() {
    hideCopy();

    canvas.classList.remove("is-hidden");

    const targets =
      createHelloTargets();

    shuffle(targets);

    while (
      particles.length <
      targets.length
    ) {
      const start =
        randomOutsidePoint();

      particles.push(
        new Particle(
          start.x,
          start.y
        )
      );
    }

    targets.forEach(
      (target, index) => {
        const particle =
          particles[index];

        particle.tx = target.x;
        particle.ty = target.y;
        particle.alpha =
          Math.max(
            particle.alpha,
            0.05
          );

        particle.targetAlpha = 1;
      }
    );

    for (
      let i = targets.length;
      i < particles.length;
      i++
    ) {
      const particle =
        particles[i];

      const exit =
        randomOutsidePoint();

      particle.tx = exit.x;
      particle.ty = exit.y;
      particle.targetAlpha = 0;
    }
  }

  function showTitle() {
    scatterParticles();

    canvas.classList.add("is-hidden");

    copyWrap.classList.remove(
      "is-hidden"
    );

    titleEl.classList.remove(
      "is-hidden"
    );

    descriptionEl.classList.add(
      "is-hidden"
    );

    titleEl.innerHTML = `
      Transformamos ideias em
      <span>soluções digitais.</span>
    `;
  }

  function showDescription() {
    scatterParticles();

    canvas.classList.add("is-hidden");

    copyWrap.classList.remove(
      "is-hidden"
    );

    titleEl.classList.add(
      "is-hidden"
    );

    descriptionEl.classList.remove(
      "is-hidden"
    );

    descriptionEl.textContent =
      "Sites, sistemas, automações e integrações desenvolvidos para fortalecer sua presença digital, organizar processos e fazer seu negócio evoluir.";
  }

  function applyScene(index) {
    const scene =
      scenes[index];

    if (
      scene.type === "particle"
    ) {
      showHello();
    }

    if (
      scene.type === "title"
    ) {
      showTitle();
    }

    if (
      scene.type === "description"
    ) {
      showDescription();
    }

    nextChangeAt =
      performance.now() +
      scene.duration;
  }

  function resizeCanvas() {
    const rect =
      canvas.parentElement
        .getBoundingClientRect();

    width =
      Math.round(
        Math.min(
          Math.max(
            rect.width,
            320
          ),
          1100
        )
      );

    height =
      window.innerWidth <= 768
        ? 300
        : 350;

    const ratio =
      window.devicePixelRatio || 1;

    canvas.width =
      Math.round(
        width * ratio
      );

    canvas.height =
      Math.round(
        height * ratio
      );

    canvas.style.width =
      `${width}px`;

    canvas.style.height =
      `${height}px`;

    ctx.setTransform(
      ratio,
      0,
      0,
      ratio,
      0,
      0
    );

    if (
      scenes[sceneIndex].type ===
      "particle"
    ) {
      showHello();
    }
  }

  function animate(time) {
    ctx.clearRect(
      0,
      0,
      width,
      height
    );

    particles.forEach(
      (particle) => {
        particle.update();
        particle.draw();
      }
    );

    ctx.globalAlpha = 1;

    if (
      time >= nextChangeAt
    ) {
      sceneIndex =
        (sceneIndex + 1) %
        scenes.length;

      applyScene(
        sceneIndex
      );
    }

    animationFrame =
      requestAnimationFrame(
        animate
      );
  }

  window.addEventListener(
    "resize",
    () => {
      clearTimeout(
        resizeTimer
      );

      resizeTimer =
        setTimeout(
          resizeCanvas,
          180
        );
    }
  );

  resizeCanvas();
  applyScene(0);

  animationFrame =
    requestAnimationFrame(
      animate
    );

  window.addEventListener(
    "beforeunload",
    () => {
      if (animationFrame) {
        cancelAnimationFrame(
          animationFrame
        );
      }
    }
  );
})();
