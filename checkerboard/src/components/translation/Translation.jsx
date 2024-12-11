import { useTranslation } from 'react-i18next';
import './translation.css'

function Translation() {
  const {t,i18n } = useTranslation();

  const handleLanguageChange = (event) => {
    const selectedLang = event.target.value;
    i18n.changeLanguage(selectedLang);
  };

  return (
    <div className="language-switcher-container">
      <label htmlFor="language-select">{ t("change")}</label>
      <select id="language-select" onChange={handleLanguageChange}>
        <option value="en">English</option>
        <option value="zh">中文</option>
      </select>
    </div>
  );
};


export default Translation;

