/* === script.js === */

document.addEventListener('DOMContentLoaded', () => { // Весь код всередині DOMContentLoaded

    // --- Код для Модального Вікна ---
    const lexusButton = document.getElementById('lexus-button');
    const mazdaButton = document.getElementById('mazda-button');
    const modal = document.getElementById('popup-modal');
    const popupMessage = document.getElementById('popup-message');
    const closeButton = modal ? modal.querySelector('.close-button') : null;

    // --- ВАШІ КОНТАКТНІ ДАНІ ---
    const phoneNumber = "+380668529330"; // Основний номер для дзвінка
    const phoneNumber2 = "+380989075420"; // Основний номер для дзвінка
    const viberNumber = "+380675307727"; // Номер для Viber (обов'язково з + та кодом країни)
    const telegramUsername = "chasi1"; // !!! ЗАМІНІТЬ НА ВАШ ЮЗЕРНЕЙМ !!!
    const operatorName = "Мирослав";
    // --- ---

    // Формуємо HTML для месенджерів ОДИН РАЗ
    // Перевіряємо, чи є номер для Viber та юзернейм для Telegram
    let messengerLinksHTML = '<div class="popup-messengers">';
    if (viberNumber || telegramUsername) {
         messengerLinksHTML += `<span>Або напишіть нам:</span>`;
    }
    if (viberNumber) {
        messengerLinksHTML += `
            <a href="viber://chat?number=%2B${viberNumber.replace(/\D/g, '')}" class="social-link viber" aria-label="Написати в Viber" target="_blank">
                <i class="fab fa-viber"></i> Viber
            </a>`;
            // .replace(/\D/g, '') - видаляє всі нецифрові символи з номера перед створенням посилання
    }
    if (telegramUsername && telegramUsername !== 'YourTelegramUsername' && telegramUsername.trim() !== '') { // Додав перевірку
        messengerLinksHTML += `
            <a href="https://t.me/${telegramUsername}" class="social-link telegram" aria-label="Написати в Telegram" target="_blank">
                <i class="fab fa-telegram"></i> Telegram
            </a>`;
    }
    messengerLinksHTML += '</div>';

     // Якщо не вказано жодного месенджера, блок не додаємо
    if (!(viberNumber || (telegramUsername && telegramUsername !== 'YourTelegramUsername' && telegramUsername.trim() !== ''))) {
        messengerLinksHTML = '';
    }


    // Функція для показу модального вікна з повідомленням
    function showPopup(baseMessage) {
        if (!modal || !popupMessage) {
            console.error("Modal window elements not found!");
            return;
        }
        // Об'єднуємо основне повідомлення та посилання на месенджери
        popupMessage.innerHTML = baseMessage + messengerLinksHTML;
        modal.classList.add('is-visible');
        document.body.classList.add('modal-open'); // Блокуємо прокрутку фону
    }

    // Функція для закриття модального вікна
    function closePopup() {
        if (!modal) return;
         modal.classList.remove('is-visible');
         document.body.classList.remove('modal-open'); // Розблоковуємо прокрутку
    }

    // Додаємо обробники подій для кнопок "Дізнатись Наявність"
    if (lexusButton) {
        lexusButton.addEventListener('click', () => {
            const baseMessage = `Щоб дізнатися про наявність та ціну запчастини для Вашого Lexus IS, будь ласка, зателефонуйте за номером: <br><strong>${phoneNumber}</strong> <br><strong>${phoneNumber2}</strong> <br>Запитайте <strong>${operatorName}</strong>.`;
            showPopup(baseMessage);
        });
    } else { console.warn("Lexus button not found"); }

    if (mazdaButton) {
        mazdaButton.addEventListener('click', () => {
            const baseMessage = `Щоб дізнатися про наявність та ціну запчастини для Вашої Mazda 5, будь ласка, зателефонуйте за номером: <br><strong>${phoneNumber}</strong> <br><strong>${phoneNumber2}</strong> <br>Запитайте <strong>${operatorName}</strong>.`;
            showPopup(baseMessage);
        });
    } else { console.warn("Mazda button not found"); }

    // Додаємо обробник події для кнопки закриття (хрестик)
    if (closeButton) {
        closeButton.addEventListener('click', closePopup);
    } else if (modal) { console.warn("Close button inside modal not found"); }


    // Закриття модального вікна при кліку поза ним
    window.addEventListener('click', (event) => {
        if (modal && event.target === modal && modal.classList.contains('is-visible')) {
            closePopup();
        }
    });

    // Закриття модального вікна клавішею Escape
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal && modal.classList.contains('is-visible')) {
            closePopup();
        }
    });
    // --- Кінець Коду для Модального Вікна ---


    // --- Код для Слайдера Галереї ---
    function initializeGallerySlider(galleryId) {
        const galleryContainer = document.getElementById(galleryId);
        if (!galleryContainer) return;
        const galleryViewport = galleryContainer.closest('.gallery-viewport');
        if (!galleryViewport) return;
        const images = galleryContainer.querySelectorAll('img');
        if (!images || images.length === 0) return;

        let visibleItemsCount = 1;
        let currentIndex = 0;
        let intervalId = null;
        let slideAmount = 0;
        let maxIndex = 0;
        let resizeTimer;

        function startSlider() {
            if (intervalId) { clearInterval(intervalId); intervalId = null; }
            const currentImages = galleryContainer.querySelectorAll('img');
            const totalImages = currentImages.length;

            if (totalImages <= visibleItemsCount) {
                galleryContainer.style.transform = 'translateX(0px)';
                // console.log(`Slider for ${galleryId} stopped: Not enough images (${totalImages} <= ${visibleItemsCount})`);
                return;
            }

            // Використовуємо offsetWidth першого зображення для розрахунку
            const firstImage = currentImages[0];
             if (!firstImage) return; // Якщо зображень немає

            const galleryStyle = window.getComputedStyle(galleryContainer);
            const imageWidth = firstImage.offsetWidth; // Беремо реальну ширину елемента
            const imageGap = parseFloat(galleryStyle.gap) || 0;


            if (imageWidth <= 0 || isNaN(imageWidth) || isNaN(imageGap)) {
                console.error(`Could not calculate valid slide amount for ${galleryId}. Width: ${imageWidth}, Gap: ${imageGap}. Slider stopped.`);
                galleryContainer.style.transform = 'translateX(0px)';
                return; // Не запускаємо, якщо розміри некоректні
            }

            slideAmount = imageWidth + imageGap;
            maxIndex = totalImages - visibleItemsCount;

            // Коригування індексу
            if (currentIndex > maxIndex) { currentIndex = maxIndex; galleryContainer.style.transform = `translateX(${-currentIndex * slideAmount}px)`; }
            else if (currentIndex < 0) { currentIndex = 0; galleryContainer.style.transform = `translateX(0px)`;}

            intervalId = setInterval(() => {
                currentIndex++;
                if (currentIndex > maxIndex) { currentIndex = 0; }
                const translateXValue = -currentIndex * slideAmount;
                galleryContainer.style.transform = `translateX(${translateXValue}px)`;
            }, 3000);
        }

        function updateSliderConfig() {
            let currentVisibleCount;
            const viewportWidth = galleryViewport.offsetWidth;

            // Визначаємо кількість видимих елементів на основі ширини viewport'а
            if (viewportWidth <= 480) { currentVisibleCount = 1; }
            else if (viewportWidth <= 920) { currentVisibleCount = 1; }
            else { currentVisibleCount = 2; }

            if (visibleItemsCount !== currentVisibleCount || intervalId === null) {
                visibleItemsCount = currentVisibleCount;
                startSlider();
            }
        }

        // Чекаємо завантаження зображень перед першим запуском (для точності offsetWidth)
        let imagesLoaded = 0;
        images.forEach(img => {
            if (img.complete) {
                imagesLoaded++;
            } else {
                img.onload = () => {
                    imagesLoaded++;
                    if (imagesLoaded === images.length) {
                        updateSliderConfig(); // Запускаємо коли всі фото завантажені
                    }
                };
                 img.onerror = () => { // На випадок помилки завантаження
                     imagesLoaded++;
                     if (imagesLoaded === images.length) {
                         updateSliderConfig();
                     }
                 };
            }
        });
        // Якщо всі зображення вже були в кеші
        if (imagesLoaded === images.length) {
           updateSliderConfig();
        }


        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateSliderConfig, 250); // Debounce
        });
    }

    // Ініціалізація слайдерів
    initializeGallerySlider('lexus-gallery');
    initializeGallerySlider('mazda-gallery');
    // --- Кінець Коду для Слайдера Галереї ---


    // --- Код для Розкриття/Приховування Списків OEM ---
    const oemToggleButtons = document.querySelectorAll('.toggle-oem-list-btn');
    const initialVisibleItemsOEM = 6; // Кількість елементів, які видно спочатку

    oemToggleButtons.forEach(button => {
        const targetId = button.getAttribute('data-target');
        const wrapper = document.getElementById(targetId);

        if (wrapper) {
            const list = wrapper.querySelector('.oem-examples');
            const listItems = list ? list.querySelectorAll('li') : [];

            // Перевіряємо реальну кількість елементів
            if (listItems.length <= initialVisibleItemsOEM) {
                button.style.display = 'none'; // Ховаємо кнопку
                wrapper.classList.add('expanded'); // Розкриваємо список
                wrapper.style.maxHeight = 'none'; // Знімаємо обмеження CSS
            } else {
                // Встановлюємо початковий стан (згорнутий) через CSS .oem-list-wrapper
                button.addEventListener('click', () => {
                    const isExpanded = wrapper.classList.toggle('expanded'); // Перемикаємо клас

                    if (isExpanded) {
                        button.textContent = 'Приховати список';
                        // Встановлюємо max-height по реальній висоті для плавної анімації розкриття
                        wrapper.style.maxHeight = wrapper.scrollHeight + "px";
                        // Після завершення анімації встановлюємо велике значення,
                        // щоб вміст міг динамічно змінюватись (якщо потрібно)
                        setTimeout(() => {
                            if (wrapper.classList.contains('expanded')) {
                                wrapper.style.maxHeight = '5000px'; // Або 'none', але може бути менш плавно
                            }
                        }, 500); // Тривалість transition з CSS
                    } else {
                        button.textContent = 'Відкрити повний список ОЕМ номерів';
                        // Щоб анімація згортання працювала, треба спочатку встановити реальну висоту,
                        // а потім вже цільову (згорнуту) висоту.
                        wrapper.style.maxHeight = wrapper.scrollHeight + "px"; // Встановлюємо поточну висоту
                        // Невелика затримка, щоб браузер встиг застосувати висоту
                        requestAnimationFrame(() => {
                             requestAnimationFrame(() => {
                                wrapper.style.maxHeight = '210px'; // Згортаємо до значення з CSS (або іншого, що визначено в медіа-запитах)
                                // Потрібно переконатись, що це значення відповідає CSS для поточного розміру екрану
                                // Можливо, краще отримати його з CSS: getComputedStyle(wrapper).maxHeight
                             });
                        });
                    }
                });
            }
        } else {
             console.warn(`Target wrapper with id "${targetId}" not found for toggle button.`);
        }
    });
    // --- Кінець Коду для Розкриття/Приховування Списків OEM ---

}); // Кінець обробника DOMContentLoaded