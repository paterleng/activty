import { useTranslation } from 'react-i18next';
import './translation.css';
import { Select, Space } from 'antd';

function Translation() {
    const { t, i18n } = useTranslation();

    const handleChange = (value) => {
        i18n.changeLanguage(value);
        console.log(`selected ${value}`);
    };

    return (
        <Space wrap>
            <Select
                defaultValue="en"
                style={{
                    width: 120,
                    height: 40,
                    optionSelectedColor:'white'
                }}
                onChange={handleChange}
                options={[
                    {
                        value: 'zh',
                        label: 'ZH',
                    },
                    {
                        value: 'en',
                        label: 'EN',
                    },
                ]}
                dropdownStyle={{
                    backgroundColor: '#3c342f', // 下拉菜单背景色
                }}
                className="custom-select"
            />
        </Space>
    );
}

export default Translation;
