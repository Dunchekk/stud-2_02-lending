/**
 * @param {{ id:string, type:string, variant:string, content:any, props:Record<string,any> }} section
 * @returns {HTMLElement}
 */
export function renderHeroBlock(section) {
  const c = section.content ?? {};

  // <div class="ll__hero-block ll__container" data-hero-section>
  const root = document.createElement("div");
  root.className = "ll__hero-block ll__container";
  root.setAttribute("data-hero-section", "");

  // <div class="ll__hero-block__title-container">
  const titleContainer = document.createElement("div");
  titleContainer.className = "ll__hero-block__title-container";

  // <nav> ... </nav>
  const nav = document.createElement("nav");

  // theme toggle button (внутри hero)
  const themeBtn = document.createElement("button");
  themeBtn.className = "ll__filled-button glass glass--pill is-liquid";
  themeBtn.type = "button";
  themeBtn.setAttribute("data-theme-toggle", "");
  themeBtn.setAttribute("aria-label", "Сменить тему");
  themeBtn.textContent = "~";

  const helpBtn = document.createElement("button");
  helpBtn.className = "ll__unfilled-button";
  helpBtn.type = "button";
  helpBtn.textContent = c.helpButtonText ?? "Получить помощь";

  const quizBtn = document.createElement("button");
  quizBtn.className = "ll__unfilled-button";
  quizBtn.type = "button";
  quizBtn.textContent = c.quizButtonText ?? "?!";

  nav.append(themeBtn, helpBtn, quizBtn);

  // <div class="ll__hero-block__info-container">
  const info = document.createElement("div");
  info.className = "ll__hero-block__info-container";

  const h1 = document.createElement("h1");
  h1.className = "ll__text-title-h1";
  h1.innerHTML = c.titleHtml ?? "—";

  const p = document.createElement("p");
  p.className = "ll__text-description-20-white";
  p.textContent = c.description ?? "";

  const buttons = document.createElement("div");
  buttons.className = "ll__hero-block__buttons-container";

  const buyBtn = document.createElement("button");
  buyBtn.className = "ll__filled-button glass glass--pill is-liquid";
  buyBtn.type = "button";
  buyBtn.textContent = c.primaryCtaText ?? "Купить";

  const moreBtn = document.createElement("button");
  moreBtn.className = "ll__unfilled-button";
  moreBtn.type = "button";
  moreBtn.textContent = c.secondaryCtaText ?? "Узнать больше";

  buttons.append(buyBtn, moreBtn);
  info.append(h1, p, buttons);

  const year = document.createElement("span");
  year.className = "ll__text-description-20-white";
  year.textContent = c.yearMark ?? "/2026";

  titleContainer.append(nav, info, year);

  // <div class="ll__hero-block__img-container"> ... </div>
  const imgContainer = document.createElement("div");
  imgContainer.className = "ll__hero-block__img-container";

  const tag = document.createElement("span");
  tag.className = "ll__text-description-20-dark";
  tag.textContent = c.rightTopTag ?? "/#wearemorethenyouthink";

  const navText = document.createElement("p");
  navText.className = "ll__text-description-20-dark ll__hero-block-nav-text";
  navText.innerHTML =
    c.rightNavTextHtml ??
    "Что это •<br>Общая информация •<br>Конкуренты •<br>Тарифы •<br>Отзывы •<br>FAG •";

  const email = document.createElement("span");
  email.className = "ll__text-description-20-dark";
  email.textContent = c.rightEmail ?? "/revolutionproduct@mail.com";

  imgContainer.append(tag, navText, email);

  root.append(titleContainer, imgContainer);
  return root;
}
