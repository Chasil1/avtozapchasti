/* === script.js === */

document.addEventListener('DOMContentLoaded', () => { // Весь код всередині DOMContentLoaded

    // --- Код для Модального Вікна ---
    const lexusButton = document.getElementById('lexus-button');
    const mazdaButton = document.getElementById('mazda-button');
    const modal = document.getElementById('popup-modal');
    const popupMessage = document.getElementById('popup-message');
    const closeButton = modal ? modal.querySelector('.close-button') : null;

    const phoneNumber = "+380668629330";
    const operatorName = "Мирослав";

    function showPopup(message) {
        if (!modal || !popupMessage) {
            console.error("Modal window elements not found!");
            return;
        }
        popupMessage.innerHTML = message;
        modal.classList.add('is-visible');
        document.body.classList.add('modal-open'); // Блокуємо прокрутку фону
    }

    function closePopup() {
        if (!modal) return;
        modal.classList.remove('is-visible');
        document.body.classList.remove('modal-open'); // Розблоковуємо прокрутку
    }

    if (lexusButton) {
        lexusButton.addEventListener('click', () => {
            const message = `Щоб дізнатися про наявність та ціну запчастини для Вашого Lexus IS, будь ласка, зателефонуйте за номером: <br><strong>${phoneNumber}</strong>. <br>Запитайте <strong>${operatorName}</strong>.`;
            showPopup(message);
        });
    } else { console.warn("Lexus button not found"); }

    if (mazdaButton) {
        mazdaButton.addEventListener('click', () => {
            const message = `Щоб дізнатися про наявність та ціну запчастини для Вашої Mazda 5, будь ласка, зателефонуйте за номером: <br><strong>${phoneNumber}</strong>. <br>Запитайте <strong>${operatorName}</strong>.`;
            showPopup(message);
        });
    } else { console.warn("Mazda button not found"); }

    if (closeButton) {
        closeButton.addEventListener('click', closePopup);
    } else if (modal) { console.warn("Close button inside modal not found"); }

    window.addEventListener('click', (event) => {
        if (modal && event.target === modal && modal.classList.contains('is-visible')) {
            closePopup();
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal && modal.classList.contains('is-visible')) {
            closePopup();
        }
    });
    // --- Кінець Коду для Модального Вікна ---


    // --- Код для Слайдера Галереї ---
    function initializeGallerySlider(galleryId) {
        const galleryContainer = document.getElementById(galleryId);
        if (!galleryContainer) {
            // console.warn(`Gallery container with id "${galleryId}" not found.`);
            return;
        }
        const galleryViewport = galleryContainer.closest('.gallery-viewport');
        if (!galleryViewport) {
            // console.warn(`Gallery viewport for gallery "${galleryId}" not found.`);
            return;
        }
        const images = galleryContainer.querySelectorAll('img');
        if (!images || images.length === 0) {
            // console.warn(`No images found in gallery "${galleryId}".`);
            return;
        }

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

            const imageStyle = window.getComputedStyle(currentImages[0]);
            const galleryStyle = window.getComputedStyle(galleryContainer);
            const imageWidth = parseFloat(imageStyle.width) || 0;
            const imageGap = parseFloat(galleryStyle.gap) || 0;

            if (imageWidth === 0 || isNaN(imageWidth) || isNaN(imageGap)) {
                console.error(`Could not calculate slide amount for ${galleryId}. Width: ${imageWidth}, Gap: ${imageGap}. Slider not started.`);
                galleryContainer.style.transform = 'translateX(0px)';
                return;
            }

            slideAmount = imageWidth + imageGap;
            maxIndex = totalImages - visibleItemsCount;

            if (currentIndex > maxIndex) { currentIndex = maxIndex; galleryContainer.style.transform = `translateX(${-currentIndex * slideAmount}px)`; }
            else if (currentIndex < 0) { currentIndex = 0; galleryContainer.style.transform = `translateX(0px)`;}

            // console.log(`Starting slider for ${galleryId}: Total=${totalImages}, Visible=${visibleItemsCount}, SlideAmount=${slideAmount.toFixed(2)}, MaxIndex=${maxIndex}`);

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
            // Значення мають відповідати CSS @media запитам
            if (viewportWidth <= 480) { // Мобільні
                 currentVisibleCount = 1;
            } else if (viewportWidth <= 920) { // Планшети та вузькі десктопи
                 currentVisibleCount = 1;
             } else { // Широкі десктопи
                 currentVisibleCount = 2;
             }

            if (visibleItemsCount !== currentVisibleCount || intervalId === null) {
                // console.log(`Updating slider config for ${galleryId}. New visible count: ${currentVisibleCount}`);
                visibleItemsCount = currentVisibleCount;
                startSlider(); // Перезапускаємо інтервал з новими параметрами
            }
        }

        updateSliderConfig(); // Ініціалізація при завантаженні

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateSliderConfig, 250); // Debounce
        });
    }

    initializeGallerySlider('lexus-gallery');
    initializeGallerySlider('mazda-gallery');
    // --- Кінець Коду для Слайдера Галереї ---


    // --- Код для Розкриття/Приховування Списків OEM ---
    const oemToggleButtons = document.querySelectorAll('.toggle-oem-list-btn');
    const initialVisibleItems = 6; // Кількість елементів, які видно спочатку (впливає тільки на ховання кнопки)

    oemToggleButtons.forEach(button => {
        const targetId = button.getAttribute('data-target'); // ID цільового WRAPPER'а
        const wrapper = document.getElementById(targetId);

        if (wrapper) {
            const list = wrapper.querySelector('.oem-examples');
            const listItems = list ? list.querySelectorAll('li') : [];

            // Ховаємо кнопку і розкриваємо список, якщо елементів мало
            if (listItems.length <= initialVisibleItems) {
                button.style.display = 'none';
                wrapper.classList.add('expanded'); // Розкриваємо список одразу
                wrapper.style.maxHeight = 'none'; // Знімаємо обмеження висоти
            } else {
                 // Додаємо обробник кліку тільки якщо елементів достатньо
                 button.addEventListener('click', () => {
                    const isExpanded = wrapper.classList.toggle('expanded'); // Перемикаємо клас

                    // Змінюємо текст кнопки
                    if (isExpanded) {
                        button.textContent = 'Приховати список';
                    } else {
                        button.textContent = 'Відкрити повний список ОЕМ номерів';
                    }
                });
            }
        } else {
             console.warn(`Target wrapper with id "${targetId}" not found for toggle button.`);
        }
    });
    // --- Кінець Коду для Розкриття/Приховування Списків OEM ---

}); // Кінець обробника DOMContentLoaded