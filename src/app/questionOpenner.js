const CONTAINER_SELECTOR = ".ll__faq-block__question-container";
const QUESTION_SELECTOR = ".ll__faq-block__question";
const ANSWER_SELECTOR = ".ll__faq-block__answer";
const OPEN_PADDING_VALUE = "calc(var(--space) * 3)";
const CLOSED_PADDING_VALUE = "0px";
const OPEN_MARGIN_VALUE = "var(--ll-average-gap)";
const CLOSED_MARGIN_VALUE = "0px";

export function initQuestionOpenner() {
  const containers = document.querySelectorAll(CONTAINER_SELECTOR);
  if (!containers.length) return;

  containers.forEach((container) => {
    const question = container.querySelector(QUESTION_SELECTOR);
    const answer = container.querySelector(ANSWER_SELECTOR);
    if (!question || !answer) return;

    // ensure default collapsed state
    container.classList.remove("is-open");
    setCollapsed(answer, { immediate: true });
    answer.classList.remove("is-visible", "is-opaque");
    applySpacing(answer, CLOSED_PADDING_VALUE, CLOSED_MARGIN_VALUE);
    question.setAttribute("role", "button");
    question.setAttribute("tabindex", "0");
    question.setAttribute("aria-expanded", "false");
    answer.setAttribute("aria-hidden", "true");

    const toggle = () => {
      const isOpen = container.classList.contains("is-open");
      if (isOpen) {
        collapse(container, answer, question);
      } else {
        expand(container, answer, question);
      }
    };

    question.addEventListener("click", toggle);
    question.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    });
  });
}

function expand(container, answer, question) {
  container.classList.add("is-open");
  answer.classList.add("is-visible");
  requestAnimationFrame(() => {
    answer.classList.add("is-opaque");
    setExpanded(answer);
  });
  question.setAttribute("aria-expanded", "true");
  answer.setAttribute("aria-hidden", "false");
}

function collapse(container, answer, question) {
  container.classList.remove("is-open");
  setCollapsed(answer);
  question.setAttribute("aria-expanded", "false");
  answer.setAttribute("aria-hidden", "true");
}

function setExpanded(answer) {
  cleanupTransitionHandler(answer);
  const startHeight = answer.offsetHeight || 0;
  const previousTransition = answer.style.transition;

  suppressTransition(answer);
  applySpacing(answer, OPEN_PADDING_VALUE, OPEN_MARGIN_VALUE);
  answer.style.height = "auto";
  const targetHeight = answer.scrollHeight;
  answer.style.height = `${startHeight}px`;
  applySpacing(answer, CLOSED_PADDING_VALUE, CLOSED_MARGIN_VALUE);
  // force reflow
  answer.offsetHeight;
  restoreTransition(answer, previousTransition);

  requestAnimationFrame(() => {
    applySpacing(answer, OPEN_PADDING_VALUE, OPEN_MARGIN_VALUE);
    answer.style.height = `${targetHeight}px`;
  });
  const handle = (event) => {
    if (event.propertyName !== "height") return;
    answer.style.height = "auto";
    answer.removeEventListener("transitionend", handle);
    answer.__heightTransitionHandler = null;
  };
  answer.__heightTransitionHandler = handle;
  answer.addEventListener("transitionend", handle);
}

function setCollapsed(answer, { immediate = false } = {}) {
  cleanupTransitionHandler(answer);
  const applyClosedSpacing = () =>
    applySpacing(answer, CLOSED_PADDING_VALUE, CLOSED_MARGIN_VALUE);
  if (immediate) {
    answer.style.height = "0px";
    applyClosedSpacing();
    answer.classList.remove("is-visible", "is-opaque");
    return;
  }

  const startHeight =
    answer.style.height === "auto" || !answer.style.height
      ? answer.scrollHeight
      : parseFloat(answer.style.height);
  answer.style.height = `${startHeight}px`;
  answer.classList.remove("is-opaque");
  // ensure browser registers current height before collapsing
  answer.offsetHeight;
  requestAnimationFrame(() => {
    answer.style.height = "0px";
    applyClosedSpacing();
  });

  const handle = (event) => {
    if (event.propertyName !== "height") return;
    answer.removeEventListener("transitionend", handle);
    answer.__heightTransitionHandler = null;
    answer.classList.remove("is-visible", "is-opaque");
  };
  answer.__heightTransitionHandler = handle;
  answer.addEventListener("transitionend", handle);
}

function cleanupTransitionHandler(answer) {
  if (answer?.__heightTransitionHandler) {
    answer.removeEventListener("transitionend", answer.__heightTransitionHandler);
    answer.__heightTransitionHandler = null;
  }
}

function applySpacing(answer, paddingValue, marginValue) {
  answer.style.setProperty("--faq-answer-padding-y", paddingValue);
  answer.style.setProperty("--faq-answer-margin", marginValue);
}

function suppressTransition(answer) {
  answer.style.transition = "none";
}

function restoreTransition(answer, original) {
  answer.style.transition = original || "";
}
