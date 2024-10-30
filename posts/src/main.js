import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import en from './locales/en.json';
import ru from './locales/ru.json';
import './assets/main.css';

const i18n = createI18n({
  locale: localStorage.getItem('lang') || 'en', // Используем сохраненный язык или 'en' по умолчанию
  fallbackLocale: 'en',
  messages: {
    en,
    ru
  }
});

const app = createApp(App);
app.use(i18n);
app.mount('#app');
