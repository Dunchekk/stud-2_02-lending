tl — корневой <section> всего слоя.
tl**left — контейнер слева (оглавление).
tl**toc — навигация-список табов внутри левого блока.
tl**tocItem — отдельные кнопки табов; активной добавляется модификатор is-active.
tl**right — правая колонка (контент + пагинатор).
tl**content — обертка для страницы таба.
tl**html — внутренняя обертка, куда заливается HTML из JSON.
tl**empty — параграф-заглушка, если таб пустой.
tl**pager — нижний блок с навигацией по страницам.
tl**pagerBtn — кнопки «вперед/назад».
tl**pagerCounter — счетчик страниц между кнопками.
tl\_\_jump — класс, который можно повесить на элементы внутри контента для внутренних переходов по табам (обрабатывается делегированным кликом).

```html
<section class="tl">
  <aside class="tl__left">
    <nav class="tl__toc" aria-label="Оглавление">
      <button class="tl__tocItem is-active">Жанр лендинга</button>
      <button class="tl__tocItem">Предисловие</button>
      <button class="tl__tocItem">Положение вещей</button>
    </nav>
  </aside>

  <main class="tl__right">
    <div class="tl__content">
      <div class="tl__html">
        <p>
          <strong>Жанр лендинга</strong><br />
          Здесь текст первой страницы таба, который приходит из JSON.
        </p>
        <button class="tl__jump" data-tab="tab-pre">
          Перейти к предисловию
        </button>
      </div>
    </div>

    <div class="tl__pager">
      <button class="tl__pagerBtn" type="button">←</button>
      <div class="tl__pagerCounter">1/3</div>
      <button class="tl__pagerBtn" type="button">→</button>
    </div>
  </main>
</section>
```

---

we should use
-- canvas 2d
-- PixiJS 6.2.0
