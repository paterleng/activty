import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 语言资源
const resources = {
  en: {
    translation: {
      "hello": "Hello",
      "welcome": "Welcome to our application",
      "total": "total",
      "change": "changeLanguage"
    }
  },
  zh: {
    translation: {
      "hello": "你好",
      "welcome": "欢迎来到我们的应用",
      "total": "总数",
      "change":"切换语言"
    }
  }
};

// 初始化 i18next
i18n
  .use(initReactI18next) // 把 react-i18next 绑定到 i18next
  .init({
    resources,  // 语言资源
    lng: "en",  // 默认语言
    keySeparator: false, // 不使用键分隔符
    interpolation: {
      escapeValue: false, // React 已经处理了 XSS 问题
    },
  });

export default i18n;
