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

<monopo-gradient color1="#16254b" color2="#23418a" color3="#aadfd9" color4="#e64f0f" colorsize="0.75" colorspacing="0.52" colorrotation="-0.381592653589793" colorspread="4.52" coloroffset="-0.7741174697875977,-0.20644775390624992" displacement="1.8621600072796953" seed="0.4140699590555228" position="-0.2816110610961914,-0.43914794921875" zoom="0.72" spacing="4.27" noretina="true" class="c-PixiIntro-gradient" style="height: 851px;"></monopo-gradient>

---

<div id="app">

      <!-- hero-block -->
      <div class="ll__hero-block ll__container" data-hero-section>
        <div class="ll__hero-block__title-container">
          <nav>
            <button
              class="ll__filled-button glass glass--pill is-liquid"
              data-theme-toggle
              aria-label="Сменить тему"
            >
              ~
            </button>
            <button class="ll__unfilled-button">Получить помощь</button>
            <button class="ll__unfilled-button">?!</button>
          </nav>
          <div class="ll__hero-block__info-container">
            <h1 class="ll__text-title-h1">Меньше шума.<br>Больше ясности.</h1> <!-- title подтягивается из варианта -->
            <p class="ll__text-description-20-white">Первое в России системное решение для устойчивого состояния в условиях перегруженной среды.</p> <!-- description подтягивается из варианта-->
            <div class="ll__hero-block__buttons-container">
              <button class="ll__filled-button glass glass--pill is-liquid">Купить</button>
              <button class="ll__unfilled-button">Узнать больше</button>
            </div>
          </div>
          <span class="ll__text-description-20-white">/2026</span>
        </div>
        <div class="ll__hero-block__img-container">
          <span class="ll__text-description-20-dark">/#wearemorethenyouthink</span>
          <p class="ll__text-description-20-dark ll__hero-block-nav-text">Что это •<br>Общая информация •<br>Конкуренты •<br>Тарифы •<br>Отзывы •<br>FAG •</p>
          <span class="ll__text-description-20-dark">/revolutionproduct@mail.com</span>
        </div>
      </div>

      <!-- это важная кнопка, её надо тоже сделать, думаю в index.js это надо будет сделать при первой инициализации страницы. Она остается на странице всегда, она position fixed -->
      <button
        class="ll__filled-button glass glass--pill is-liquid ll__theme-toggle-button ll__theme-toggle--floating"
        data-theme-toggle
        aria-label="Сменить тему"
      >
        ~
      </button>


      <!-- what-is-it-block -->
      <div class="ll__what-is-it-block ll__container">

        <div class="ll__title-container">
          <h2>Что это?</h2> <!-- title подтягивается из варианта -->
          <p></p> <!-- description подтягивается из варианта-->
        </div>

        <div class="ll__what-is-it-block__sections-container"> <!-- внутри обязательно 3 варианта h3+p, которые подтягиваются из варианта (в одном варианте 3*(h3+p))-->
          <div class="ll__what-is-it-block-section">
            <div class="ll__what-is-it-block-bubble glass glass--strong is-liquid">
              <h3>Фоновая психологичсекая устойчивость</h3> <!-- меняется, это один h3-->
              <p>Это работает не с отдельными состояниями, а с общим фоном восприятия, который формируется в условиях информационного шума.</p> <!-- меняется, это соответсвующий  p -->
            </div>
            <div class="ll__what-is-it-block__numeric-container">
              <h2>1.</h2>
              <button class="ll__unfilled-button">Узнать больше</button>
            </div>
          </div>
          <div class="ll__what-is-it-block-section">
            <div class="ll__what-is-it-block__numeric-container">
              <h2>2.</h2>
              <button class="ll__unfilled-button">Посмотреть подробнее</button>
            </div>
            <div class="ll__what-is-it-block-bubble  glass glass--strong is-liquid">
              <h3>Фоновая психологичсекая устойчивость</h3> <!-- меняется, это один h3-->
              <p>Это работает не с отдельными состояниями, а с общим фоном восприятия, который формируется в условиях информационного шума.</p> <!-- меняется, это соответсвующий  p -->
            </div>
          </div>
          <div class="ll__what-is-it-block-section">
            <div class="ll__what-is-it-block-bubble glass glass--strong is-liquid">
              <h3>Фоновая психологичсекая устойчивость</h3> <!-- меняется, это один h3-->
              <p>Это работает не с отдельными состояниями, а с общим фоном восприятия, который формируется в условиях информационного шума.</p> <!-- меняется, это соответсвующий  p -->
            </div>
            <div class="ll__what-is-it-block__numeric-container">
              <h2>3.</h2>
              <button class="ll__unfilled-button">Прочитать ещё</button>
            </div>
          </div>
        </div>

      </div>


      <!-- break-block -->
      <div class="ll__break-block ll__container"> <!-- максимально простой блок но вариантов у него будет больше всего. В одном варианте этого блока title+description  p -->
        <h4>Психологическая устойчивость начинается с фона</h4> <!-- это title, подтягивается из варианта -->
        <p>Мы сосредоточились на том уровне состояния, который формируется средой и определяет, насколько человек устойчив в условиях постоянной нагрузки.</p> <!-- это description, подтягивается из варианта -->
      </div>

      <!-- big-blur-content-block -->
      <div class="ll__big-blur-content-block ll__container"> <!-- тут в одном варианте h2(заголовок) + h3(подзаголовок) + p(description) + src картинки-->
        <h2>Создано, чтобы не отвлекать от жизни</h2> <!-- этот h2 подтягивается из варианта-->
        <div class="ll__big-blur-content-block__blur-container glass glass--strong is-liquid">
          <div class="ll__big-blur-content-block__blur-left-part">
            <div class="ll__big-blur-content-block__blur-left-part__title-container">
              <div class="ll__big-blur-content-block__titles">
                <h3>Клуб — пространство для тех, кто выбрал это осознанно</h3> <!-- этот h3 подтягивается из варианта-->
                <p>Клуб — это не активность и не обязательство. Это формат присутствия. Вы вступаете не ради участия, а ради ощущения принадлежности к среде, где ценят устойчивость, спокойствие и бережное отношение к себе и миру.</p> <!-- этот p подтягивается из варианта-->
              </div>
              <button class="ll__unfilled-button">Унать больше</button>
            </div>
            <button class="ll__unfilled-button ll__big-blur-content-block_question">?</button>
          </div>
          <div class="ll__big-blur-content-block__blur-container__right-part">
            <img src="./src/assets/imgs/Group 5.png" alt="">
          </div>
        </div>
      </div>

      <!-- three-filled-elements-block -->
      <div class="ll__three-filled-elements-block ll__container"> <!-- здесь тоже будет много вариантов. в одном варианте: h2(заголовок) + p(description), набор из ТРЕХ групп (h3 + p) -->

        <div class="ll__title-container">
          <h2>Наши ценности →</h2> <!-- h2 подтягивается из варианта -->
          <p>Сочетаем лучшие качества на рынке. Никто невыдерживает конкуренции.</p> <!-- p подтягивается из варианта -->
        </div>

        <div class="ll__three-filled-elements-block__three-blocks-container">
          <div class="ll__three-filled-elements-block__block">
              <h3>1. Доброта</h3> <!-- каждый из трех блоков h3 со своим p тоже подтягиваются из варианта -->
              <p>Каждое решение строится с пониманием влияния среды на внимание, восприятие и психологическое благополучие человека.</p>
          </div>
          <div class="ll__three-filled-elements-block__block">
              <h3>2. Осознанность</h3>
              <p>Каждое решение строится с пониманием влияния среды на внимание, восприятие и психологическое благополучие человека.</p>
          </div>
          <div class="ll__three-filled-elements-block__block">
              <h3>3. Практичность</h3>
              <p>Каждое решение строится с пониманием влияния среды на внимание, восприятие и психологическое благополучие человека.</p>
          </div>
        </div>
      </div>

      <!-- why-we-block -->
      <div class="ll__why-we-block ll__container"> <!-- этот блок достает из варианта: h2(title) + p(description) + два названия массива (array-left-title, array-right-title), два этих массива с элементами -- массивы left и right. В левом всегда набормэлементов на 1 меньше чем в превом. 1 элемент состоит из h4(mini-title) + p(mini-description) -->
        <div class="ll__title-container">
          <h2>Почему именно мы →</h2> <!-- title достается из варианта -->
          <p>Сочетаем лучшие качества на рынке. Никто невыдерживает конкуренции.</p> <!-- description достается из варианта -->
        </div>

        <div class="ll__why-we-block__container">

          <div class="ll__why-we-block__left ">
            <h4>они --</h4> <!-- название левого массива достается из варианта -->
            <div class="ll__why-we-block__left-unfilled-part  glass glass--strong is-liquid">
              <h3>×</h3>
              <div class="ll__why-we-block__sub-text-container"> <!-- один элемент левого массива, его h4 и p достаются из варианта -->
                <h4>Перегруженные форматы</h4>
                <p>Мы работаем с фоновым состоянием, а не с внешними показателями эффективности.</p>
              </div>
            </div>
            <div class="ll__why-we-block__left-unfilled-part glass glass--strong is-liquid">
              <h3>×</h3>
              <div class="ll__why-we-block__sub-text-container"> <!-- один элемент левого массива, его h4 и p достаются из варианта -->
                <h4>Перегруженные форматы</h4>
                <p>Мы работаем с фоновым состоянием, а не с внешними показателями эффективности.</p>
              </div>
            </div>
            <div class="ll__why-we-block__left-unfilled-part glass glass--strong is-liquid">
              <h3>×</h3>
              <div class="ll__why-we-block__sub-text-container"> <!-- один элемент левого массива, его h4 и p достаются из варианта -->
                <h4>Перегруженные форматы</h4>
                <p>Мы работаем с фоновым состоянием, а не с внешними показателями эффективности.</p>
              </div>
            </div>
          </div>

          <div class="ll__why-we-block__right"> <!-- тут правый набор элементов, он из правого массива -->
            <h4>мы --</h4>
            <div class="ll__why-we-block__right-filled-part">
              <h3>✓</h3>
              <div class="ll__why-we-block__sub-text-container"> <!-- один элемент правого массива, его h4 и p достаются из варианта -->
                <h4>Перегруженные форматы</h4>
                <p>Мы работаем с фоновым состоянием, а не с внешними показателями эффективности.</p>
              </div>
            </div>
            <div class="ll__why-we-block__right-filled-part">
              <h3>✓</h3>
              <div class="ll__why-we-block__sub-text-container"> <!-- один элемент правого массива, его h4 и p достаются из варианта -->
                <h4>Перегруженные форматы</h4>
                <p>Мы работаем с фоновым состоянием, а не с внешними показателями эффективности.</p>
              </div>
            </div>
            <div class="ll__why-we-block__right-filled-part">
              <h3>✓</h3>
              <div class="ll__why-we-block__sub-text-container"> <!-- один элемент правого массива, его h4 и p достаются из варианта -->
                <h4>Перегруженные форматы</h4>
                <p>Мы работаем с фоновым состоянием, а не с внешними показателями эффективности.</p>
              </div>
            </div>
            <div class="ll__why-we-block__right-filled-part">
              <h3>✓</h3>
              <div class="ll__why-we-block__sub-text-container"> <!-- один элемент правого массива, его h4 и p достаются из варианта. Видишь, правый на 1 больше левого -->
                <h4>Перегруженные форматы</h4>
                <p>Мы работаем с фоновым состоянием, а не с внешними показателями эффективности.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- break-block, уже видели его -->
      <div class="ll__break-block ll__container">
        <h4>Психологическая устойчивость начинается с фона</h4>
        <p>Мы сосредоточились на том уровне состояния, который формируется средой и определяет, насколько человек устойчив в условиях постоянной нагрузки.</p>
      </div>

      <!-- tarifs-block -->
      <div class="ll__tarifs-block ll__container"> <!-- из варианта достаются: h2(title) + p(description) + 3*(h2(подзаголовок тарифа) + p(описание тарифа) + массив из p (пункты тарифа)) -->

        <div class="ll__title-container">
          <h2>Почему именно мы →</h2> <!-- h2 подтягиваем из варианта -->
          <p>Сочетаем лучшие качества на рынке. Никто невыдерживает конкуренции.</p> <!-- p подтягиваем из варианта -->
        </div>

        <div class="ll__tarifs-block__tarifs-container">

          <div class="ll__tarifs-block__tarif tarif1 glass glass--strong is-liquid">
            <div class="ll__tarifs-block__titles">
              <h2>Базовый</h2> <!-- h2 подтягиваем из варианта (этот h2 лежит в информации первого из трех тарифов, sub-title тарифа)-->
              <p>Для тех, кому важна дополнительная структура и ощущение сопровождения.</p> <!-- p подтягиваем из варианта (этот p лежит в информации первого из трех тарифов, sub-description первого тарифа)-->
            </div>
              <div class="ll__tarifs-block__tarif-p"> <!-- массив пунктов p первого тарифа, тоже подтягивается из варианта -->
              <p>— всё, что включено в расширенный формат</p>
              <p>— всё, что включено в расширенный формат</p>
              <p>— всё, что включено в расширенный формат</p>
              <p>— всё, что включено в расширенный формат</p>
            </div>
            <button class="ll__unfilled-button">6799 ₮</button> <!-- цена первого тарифа, тоже подтягивается из варианта -->
          </div>

          <div class="ll__tarifs-block__tarif ll__white-container ">
            <div class="ll__tarifs-block__titles">
              <h2>Максимальный</h2>
              <p>Для тех, кому важна дополнительная структура и ощущение сопровождения.</p>
            </div>
              <div class="ll__tarifs-block__tarif-p">
              <p>— всё, что включено в расширенный формат</p>
              <p>— всё, что включено в расширенный формат</p>
              <p>— всё, что включено в расширенный формат</p>
              <p>— всё, что включено в расширенный формат</p>
              <p>— всё, что включено в расширенный формат</p>
              <p>— всё, что включено в расширенный формат</p>
              <p>— всё, что включено в расширенный формат</p>
              <p>— всё, что включено в расширенный формат</p>
            </div>
            <button class="ll__unfilled-button ll__unfilled-button-dark  glass glass--pill is-liquid">10999 ₮</button>
          </div>

          <div class="ll__tarifs-block__tarif tarif3 glass glass--strong is-liquid">
            <div class="ll__tarifs-block__titles">
              <h2>Расширенный</h2>
              <p>Для тех, кому важна дополнительная структура и ощущение сопровождения.</p>
            </div>
              <div class="ll__tarifs-block__tarif-p">
              <p>— всё, что включено в расширенный формат</p>
              <p>— всё, что включено в расширенный формат</p>
              <p>— всё, что включено в расширенный формат</p>
              <p>— всё, что включено в расширенный формат</p>
              <p>— всё, что включено в расширенный формат</p>
            </div>
            <button class="ll__unfilled-button">3999 ₮</button>
          </div>
        </div>
      </div>

      <!-- big-blur-content-block, уже видели его. -->
      <div class="ll__big-blur-content-block ll__container">
        <h2>Побеждай вместе с нашим клубом!</h2>
        <div class="ll__big-blur-content-block__blur-container glass glass--strong is-liquid">
          <div class="ll__big-blur-content-block__blur-left-part">
            <div class="ll__big-blur-content-block__blur-left-part__title-container">
              <div class="ll__big-blur-content-block__titles">
                <h3>Клуб — пространство для тех, кто выбрал это осознанно</h3>
                <p>Клуб — это не активность и не обязательство. Это формат присутствия. Вы вступаете не ради участия, а ради ощущения принадлежности к среде, где ценят устойчивость, спокойствие и бережное отношение к себе и миру.</p>
              </div>
              <button class="ll__unfilled-button">Узнать больше</button>
            </div>
            <button class="ll__unfilled-button ll__big-blur-content-block_question">?</button>
          </div>
          <img src="./src/assets/imgs/22.svg" class="ll__big-blur-content-block__blur-container__right-part-filled"></img>
        </div>
      </div>

      <!-- bubbles-block -->
      <div class="ll__bubbles-block ll__container"> <!-- вариант этого блока состоит из 3 или 6 отзывов. из вараинта достается: h2 + p + 6*(h4 + p-mini + p) или h2 + p + 3*(h4 + p-mini + p)-->

        <div class="ll__title-container">
          <h2>Те, кто уже приобрели это,  поделятся опытом →</h2> <!-- title подтягивается из варианта -->
          <p>Наши тарифы рассчитыны таким образом, чтобы любой человек нашел что-то для себя.</p> <!-- description подтягивается из варианта -->
        </div>

        <div class="ll__bubbles-block__three-blocks-container">

          <div class="ll__bubbles-block__two-blocks"> <!-- если всего 6 отзывов, то кладем в этот блок 2 отзыва (первый и второй). Если всего 3 отзыва, то кладем в этот блок 1 отзыв (первый)-->

            <div class="ll__bubbles-block__bubble bubble1 glass glass--strong is-liquid"> <!-- Это первый отзыв. Дальше все 6 (или 3) собираются таким же образом, подтягиваясь из одного варианта -->
              <div class="ll__bubbles-block__person">
                <img src="./src/assets/imgs/ppl/image10 (1).png" alt="">
                <div  class="ll__bubbles-block__person__info">
                  <h4>Антон, 35 лет</h4> <!-- h4 подтягивается из 1 отзыва -->
                  <p>Директор большой комании</p> <!-- p-mini подтягивается из 1 отзыва -->
                </div>
              </div>
              <p>«Сначала сомневался, нужно ли мне это. Теперь не представляю, зачем отказываться.»</p> <!-- p подтягивается из 1 отзыва -->
            </div>

            <div class="ll__bubbles-block__bubble bubble2 ll__white-container">
              <div class="ll__bubbles-block__person">
                <img src="./src/assets/imgs/ppl/image10 (1).png" alt="">
                <div  class="ll__bubbles-block__person__info">
                  <h4>Антон, 35 лет</h4>
                  <p>Директор большой комании</p>
                </div>
              </div>
              <p>«Сначала сомневался, нужно ли мне это. Теперь не представляю, зачем отказываться.»</p>
            </div>

          </div>

          <div class="ll__bubbles-block__two-blocks">  <!-- если всего 6 отзывов, то кладем в этот блок 2 отзыва (третий и четвертый). Если всего 3 отзыва, то кладем в этот блок 1 отзыв (второй)-->

            <div class="ll__bubbles-block__bubble bubble3 ll__white-container">
            <div class="ll__bubbles-block__person">
              <img src="./src/assets/imgs/ppl/image10 (1).png" alt="">
              <div  class="ll__bubbles-block__person__info">
                <h4>Антон, 35 лет</h4>
                <p>Директор большой комании</p>
              </div>
            </div>
              <p>«Сначала сомневался, нужно ли мне это. Теперь не представляю, зачем отказываться.»</p>
            </div>

            <div class="ll__bubbles-block__bubble bubble4 glass glass--strong is-liquid">
              <div class="ll__bubbles-block__person">
                <img src="./src/assets/imgs/ppl/image10 (1).png" alt="">
                <div  class="ll__bubbles-block__person__info">
                  <h4>Антон, 35 лет</h4>
                  <p>Директор большой комании</p>
                </div>
              </div>
              <p>«Сначала сомневался, нужно ли мне это. Теперь не представляю, зачем отказываться.»</p>
            </div>

          </div>

          <div class="ll__bubbles-block__two-blocks"> <!-- если всего 6 отзывов, то кладем в этот блок 2 отзыва (пятый и шестой). Если всего 3 отзыва, то кладем в этот блок 1 отзыв (третий)-->

            <div class="ll__bubbles-block__bubble bubble5 glass glass--strong is-liquid">
              <div class="ll__bubbles-block__person">
                <img src="./src/assets/imgs/ppl/image10 (1).png" alt="">
                <div  class="ll__bubbles-block__person__info">
                  <h4>Антон, 35 лет</h4>
                  <p>Директор большой комании</p>
                </div>
              </div>
              <p>«Сначала сомневался, нужно ли мне это. Теперь не представляю, зачем отказываться.»</p>
            </div>

            <div class="ll__bubbles-block__bubble bubble6 ll__white-container">
              <div class="ll__bubbles-block__person">
                <img src="./src/assets/imgs/ppl/image10 (1).png" alt="">
                <div  class="ll__bubbles-block__person__info">
                  <h4>Антон, 35 лет</h4>
                  <p>Директор большой комании</p>
                </div>
              </div>
              <p>«Сначала сомневался, нужно ли мне это. Теперь не представляю, зачем отказываться.»</p>
            </div>
          </div>
        </div>
      </div>


      <!-- break-block, уже видели его -->
      <div class="ll__break-block ll__container">
        <h4>Психологическая устойчивость начинается с фона</h4>
        <p>Мы сосредоточились на том уровне состояния, который формируется средой и определяет, насколько человек устойчив в условиях постоянной нагрузки.</p>
      </div>


      <!-- faq-block -->
      <div class="ll__faq-block ll__container">


        <div class="ll__title-container"> <!-- из варианта в этом блоке подтягиваются: h2 + p + array-left( в нем несколько fag-item; в одном fag-item h5 + p) + array-right( в нем несколько fag-item; в одном fag-item h5 + p)-->
          <h2>FAQ →</h2> <!-- h2 подтягивается из варианта-->
          <p>Если не найдете ответа на ваш вопрос, просто напишите нам его!</p> <!-- p подтягивается из варианта-->
        </div>

        <div class="ll__faq-block__faq-container">

          <div class="ll__faq-block__left"> <!-- набор faq-item левого массива-->

            <div class="ll__faq-block__question-container"> <!-- faq-item: h5(question) + p(answer). Так устроен каждый faq-item, их может быть несколько в массиве (и в правом и в левом) -->
              <div class="ll__faq-block__question">
                <h4>+</h4>
                <h5>Что именно я получу?</h5> <!-- вопрос подтягивающийся из faq-item-quastion-->
              </div>
              <div class="ll__faq-block__answer glass glass--strong is-liquid">
                <p>Ощущение устойчивости и поддержки без давления и обязательств.<br><br>Это — современное решение, которое помогает снизить фоновую тревожность, убрать ощущение внутреннего шума и вернуть устойчивость в повседневный ритм.</p> <!-- ответ подтягивающийся из faq-item-quastion-->
              </div>
            </div>

            <div class="ll__faq-block__question-container">
              <div class="ll__faq-block__question">
                <h4>+</h4>
                <h5>Что именно я получу?</h5>
              </div>
              <div class="ll__faq-block__answer glass glass--strong is-liquid">
                <p>Ощущение устойчивости и поддержки без давления и обязательств.<br><br>Это — современное решение, которое помогает снизить фоновую тревожность, убрать ощущение внутреннего шума и вернуть устойчивость в повседневный ритм.</p>
              </div>
            </div>

            <div class="ll__faq-block__question-container">
              <div class="ll__faq-block__question">
                <h4>+</h4>
                <h5>Что именно я получу?</h5>
              </div>
              <div class="ll__faq-block__answer glass glass--strong is-liquid">
                <p>Ощущение устойчивости и поддержки без давления и обязательств.<br><br>Это — современное решение, которое помогает снизить фоновую тревожность, убрать ощущение внутреннего шума и вернуть устойчивость в повседневный ритм.</p>
              </div>
            </div>

          </div>

          <div class="ll__faq-block__right"> <!-- набор faq-item правого массива-->

            <div class="ll__faq-block__question-container">
              <div class="ll__faq-block__question">
                <h4>+</h4>
                <h5>Что именно я получу?</h5>
              </div>
              <div class="ll__faq-block__answer glass glass--strong is-liquid">
                <p>Ощущение устойчивости и поддержки без давления и обязательств.<br><br>Это — современное решение, которое помогает снизить фоновую тревожность, убрать ощущение внутреннего шума и вернуть устойчивость в повседневный ритм.</p>
              </div>
            </div>

            <div class="ll__faq-block__question-container">
              <div class="ll__faq-block__question">
                <h4>+</h4>
                <h5>Что именно я получу?</h5>
              </div>
              <div class="ll__faq-block__answer glass glass--strong is-liquid">
                <p>Это — современное решение, которое помогает снизить фоновую тревожность, убрать ощущение внутреннего шума и вернуть устойчивость в повседневный ритм.</p>
              </div>
            </div>

            <div class="ll__faq-block__question-container">
              <div class="ll__faq-block__question">
                <h4>+</h4>
                <h5>Что именно я получу?</h5>
              </div>
              <div class="ll__faq-block__answer glass glass--strong is-liquid">
                <p>Ощущение устойчивости и поддержки без давления и обязательств.<br><br>Это — современное решение, которое помогает снизить фоновую тревожность, убрать ощущение внутреннего шума и вернуть устойчивость в повседневный ритм.</p>
              </div>
            </div>


          </div>

        </div>

      </div>

      <!-- prog-block -->
      <div class="ll__prog-block ll__container"> <!-- в этом блоке из вараинта подтягиваются: h2 + p + (h3 + p + массив-info1(в нем до трех пунктов p) + массив info2 (в нем тоже до трех пунктов))-->
        <div class="ll__title-container">
          <h2>Попробуйте корпоративную программу →</h2> <!-- h2 подтягивается из вараинта -->
          <p>Мы точно нужны вашей команде для поддержания хорошего климата в коллективе.</p> <!-- p подтягивается из вараинта -->
        </div>

        <div class="ll__prog-block__main-shape glass glass--soft is-liquid">
          <div class="ll__prog-block__main-container">

          <div class="ll__prog-block__title-container">
            <h3>Корпоративная программа</h3> <!-- h3 подтягивается из вараинта -->
            <p>Подходит для команд, работающих в условиях постоянной нагрузки.</p> <!-- p подтягивается из вараинта -->
          </div>
          <div class="ll__prog-block__info-container">
            <div class="ll__p-b__info1"> <!-- из вараинта подтягивается до трех элементов p левого массива-->
              <p>— спокойный формат без вмешательства в рабочие процессы</p>
              <p>— снижение фонового напряжения и перегрузки</p>
              <p>— гибкая интеграция в существующую корпоративную среду</p>
            </div>
            <div class="ll__p-b__info2"> <!-- из вараинта подтягивается до трех элементов p правого массива-->
              <p>— спокойный формат без вмешательства в рабочие процессы</p>
              <p>— снижение фонового напряжения и перегрузки</p>
            </div>
          </div>
        </div>

        </div>

      </div>

      <!-- stat-block-->
      <div class="ll__stat-block ll__container"> <!-- из вараинта подтягивается: h4 + p. Это редкий блок. -->
        <div class="ll__title-container">
          <h4>Результаты нашей программы →</h4>
          <p>Мы точно нужны вашей команде для поддержания хорошего климата в коллективе.</p>
          <button class="ll__filled-button glass glass--pill is-liquid">Узнать больше</button>
        </div>
        <img src="./src/assets/imgs/stst.svg" alt="">
      </div>

      <!-- break-block, уже видели его-->
      <div class="ll__break-block ll__container">
        <h4>Психологическая устойчивость начинается с фона</h4>
        <p>Мы сосредоточились на том уровне состояния, который формируется средой и определяет, насколько человек устойчив в условиях постоянной нагрузки.</p>
      </div>


      </div>

    </div>

---

## DOM после загрузки (новая архитектура)

`#feed` создаётся в `src/main.js` функцией `ensureFeed(app)` и монтируется ВНУТРЬ `div#app`. Все секции лендинга из `renderers/*` попадают именно в `main#feed.ll__feed` (через `mountSections(feed, page.sections)`), а дальше `infiniteLoader` может добавлять/удалять секции внутри `#feed` при скролле.

Ниже — примерная HTML-структура “как в браузере” после инициализации (без подробностей внутри каждой секции):

```html
<html data-tl-theme="...">
  <body data-tl-theme="...">
    <div id="app">
      <!-- фон-градиент (Pixi) -->
      <dunchek-gradient class="c-PixiIntro-gradient" style="z-index: 1">
        <canvas></canvas>
      </dunchek-gradient>

      <!-- текстовый слой -->
      <section class="tl" style="z-index: 0" aria-label="Text layer">
        <aside class="tl__left">
          <nav class="tl__toc"></nav>
          <div class="tl__themes"></div>
        </aside>
        <main class="tl__right">
          <div class="tl__content"></div>
          <div class="tl__pager"></div>
        </main>
      </section>

      <!-- контейнер секций лендинга (рендереры монтируются сюда) -->
      <main id="feed" class="ll__feed">
        <!-- 1) hero-block -->
        <div
          class="ll__hero-block ll__container"
          data-hero-section
          data-section-type="hero-block"
        >
          <!-- ... -->
          <!-- кнопка ~ внутри hero -->
          <button data-theme-toggle type="button">~</button>
        </div>

        <!-- 2) остальные блоки из page.json -->
        <div
          class="ll__what-is-it-block ll__container"
          data-section-type="what-is-it-block"
        ></div>
        <div
          class="ll__break-block ll__container"
          data-section-type="break-block"
        ></div>
        <div
          class="ll__big-blur-content-block ll__container"
          data-section-type="big-blur-content-block"
        ></div>
        <div
          class="ll__three-filled-elements-block ll__container"
          data-section-type="three-filled-elements-block"
        ></div>
        <div
          class="ll__why-we-block ll__container"
          data-section-type="why-we-block"
        ></div>
        <div
          class="ll__tarifs-block ll__container"
          data-section-type="tarifs-block"
        ></div>
        <div
          class="ll__bubbles-block ll__container"
          data-section-type="bubbles-block"
        ></div>
        <div
          class="ll__faq-block ll__container"
          data-section-type="faq-block"
        ></div>
        <div
          class="ll__prog-block ll__container"
          data-section-type="prog-block"
        ></div>
        <div
          class="ll__stat-block ll__container"
          data-section-type="stat-block"
        ></div>
      </main>
    </div>

    <!-- fixed кнопка ~ (вне #app, монтируется прямо в body) -->
    <button
      class="ll__filled-button glass glass--pill is-liquid ll__theme-toggle-button ll__theme-toggle--floating"
      data-theme-toggle
      type="button"
    >
      ~
    </button>

    <!-- svg-filter стекла из index.html -->
    <svg width="0" height="0" style="position: absolute">
      <filter id="glass-liquid">...</filter>
    </svg>

    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

      color1: "#8C00FF",
      color2: "#8C00FF",
      color3: "#8a00b8",
      color4: "#2e0054",
      color5: "#8C00FF",
      bgcolor: "#010811",
