import { useTranslation } from 'react-i18next';
import './translation.css'

function Translation() {
  const {t,i18n } = useTranslation();

  const handleLanguageChange = (event) => {
    const selectedLang = event.target.value;
    i18n.changeLanguage(selectedLang);
  };

  return (
      <select className='language-switcher-select' id="language-select" onChange={handleLanguageChange}>
        <option value="en">EN</option>
        <option value="zh">中文</option>
      </select>
  );
};


export default Translation;

