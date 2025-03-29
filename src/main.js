const prices = {
  yearly: '$39.99',
  weeklyYearly: '$0.48',
  weekly: '$6.99',
};

async function loadTranslations(language) {
  try {
    const response = await fetch(`./i18n/${language}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${language}`);
    }
    const translations = await response.json();
    return translations;
  } catch (error) {
    console.error('Failed to load translations:', error);
    return null;
  }
}
function replacePricePlaceholders(prices) {
  // Заменяем {{price}} для yearly
  const yearlyElement = document.getElementById('yearly');
  if (yearlyElement && yearlyElement.innerHTML.includes('{{price}}')) {
    yearlyElement.innerHTML = yearlyElement.innerHTML.replace('{{price}}', prices.yearly);
  }

  // Заменяем {{price}} для yearly-weekly
  const yearlyWeeklyElement = document.getElementById('yearly-weekly');
  if (yearlyWeeklyElement && yearlyWeeklyElement.innerHTML.includes('{{price}}')) {
    yearlyWeeklyElement.innerHTML = yearlyWeeklyElement.innerHTML.replace(
      '{{price}}',
      prices.weeklyYearly
    );
  }

  // Заменяем {{price}} для weekly
  const weeklyElement = document.getElementById('weekly');
  if (weeklyElement && weeklyElement.innerHTML.includes('{{price}}')) {
    weeklyElement.innerHTML = weeklyElement.innerHTML.replace('{{price}}', prices.weekly);
  }
}
// Функция для применения переводов к элементам на странице
function applyTranslations(translations) {
  Object.keys(translations).forEach((key) => {
    const elements = document.querySelectorAll(`[data-i18n="${key}"]`);
    elements.forEach((element) => {
      if (element) {
        element.innerHTML = translations[key];
      }
    });
  });
}
// Основная функция для настройки переводов
async function setupTranslations() {
  // Определяем язык системы
  const defaultLanguage = navigator.language.slice(0, 2);

  // Извлекаем параметр lang из URL
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  console.log(langParam);

  // Определяем язык для загрузки переводов
  const language = langParam || defaultLanguage;
  const supportedLanguages = ['en', 'es', 'pt', 'fr', 'de', 'ja'];

  // Если язык не поддерживается, используем английский
  const selectedLanguage = supportedLanguages.includes(language) ? language : 'en';

  // Добавляем класс языка к <body>
  document.body.classList.add(`lang-${selectedLanguage}`);

  // Загружаем переводы
  const translations = await loadTranslations(selectedLanguage);

  if (translations) {
    // Применяем переводы к элементам на странице
    applyTranslations(translations);
    // Заменяем плейсхолдеры {{price}} на соответствующие значения
    replacePricePlaceholders(prices);
  }
}

function setBackgroundImage() {
  const bgDiv = document.querySelector('.bg');

  // Test for WebP support
  const testWebP = (callback) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => callback(webP.height === 2);
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  };

  testWebP((supported) => {
    if (window.devicePixelRatio >= 3) {
      // 3x Retina display
      if (supported) {
        bgDiv.style.backgroundImage = 'url("/src/assets/bg@3x.webp")';
      } else {
        bgDiv.style.backgroundImage = 'url("/src/assets/bg@3x.jpeg")';

        // Fallback to PNG if JPEG fails (rare)
        const img = new Image();
        img.onerror = () => {
          bgDiv.style.backgroundImage = 'url("/src/assets/bg@3x.png")';
        };
        img.src = '/src/assets/bg@3x.jpeg';
      }
    } else if (window.devicePixelRatio > 1) {
      // 2x Retina display
      if (supported) {
        bgDiv.style.backgroundImage = 'url("/src/assets/bg@2x.webp")';
      } else {
        bgDiv.style.backgroundImage = 'url("/src/assets/bg@2x.jpeg")';

        // Fallback to PNG if JPEG fails (rare)
        const img = new Image();
        img.onerror = () => {
          bgDiv.style.backgroundImage = 'url("/src/assets/bg@2x.png")';
        };
        img.src = '/src/assets/bg@2x.jpeg';
      }
    } else {
      // Non-Retina display
      if (supported) {
        bgDiv.style.backgroundImage = 'url("/src/assets/bg.webp")';
      } else {
        bgDiv.style.backgroundImage = 'url("/src/assets/bg.jpeg")';

        // Fallback to PNG if JPEG fails (rare)
        const img = new Image();
        img.onerror = () => {
          bgDiv.style.backgroundImage = 'url("/src/assets/bg.png")';
        };
        img.src = '/src/assets/bg.jpeg';
      }
    }
  });
}

setupTranslations();
setBackgroundImage();

// Обработчики для выбора ячейки
document.querySelector('.yearly-btn').addEventListener('click', () => {
  selectOption('yearly');
});

document.querySelector('.weekly-btn').addEventListener('click', () => {
  selectOption('weekly');
});

// Функция для выбора опции
function selectOption(option) {
  const yearlyBtn = document.querySelector('.yearly-btn');
  const weeklyBtn = document.querySelector('.weekly-btn');

  yearlyBtn.classList.toggle('selected', option === 'yearly');
  weeklyBtn.classList.toggle('selected', option === 'weekly');
}

// Обработчик для кнопки "Continue"
document.querySelector('.btn').addEventListener('click', () => {
  const selectedOption = document.querySelector('section .selected');

  if (selectedOption.classList.contains('yearly-btn')) {
    window.location.href = 'https://apple.com/';
  } else if (selectedOption.classList.contains('weekly-btn')) {
    window.location.href = 'https://google.com/';
  }
});
