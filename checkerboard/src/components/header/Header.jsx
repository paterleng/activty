import Translation from '../translation/Translation';
import './header.css'
import {Avatar} from "antd";
import ConnectWallet from "../web3wallet/Wallet.jsx";


const Header = () => {
    return (
        <div className='header-box'>
            <div className='left-box'>
                <div className='left-box-img'>
                    <a href="https://www.todesk.com/download.html" target="_blank" rel="noopener noreferrer">
                        <Avatar
                            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                            src="/images/picture/X.png"
                            style={{cursor: 'pointer'}}
                        />
                    </a>
                </div>
                <div className='left-box-img'>
                    <a href="https://www.todesk.com/download.html" target="_blank" rel="noopener noreferrer">
                        <Avatar
                            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                            src="/images/picture/X.png"
                            style={{cursor: 'pointer'}}
                        />
                    </a>
                </div>
                <div className='left-box-img'>
                    <a href="https://www.todesk.com/download.html" target="_blank" rel="noopener noreferrer">
                        <Avatar
                            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                            src="/images/picture/tg.png"
                            style={{cursor: 'pointer'}}
                        />
                    </a>
                </div>

            </div>
            <div className='right-box'>
                <div className="token-div">
                    <ConnectWallet/>
                </div>
                <div>
                    <Translation/>
                </div>
            </div>
        </div>
    );
};

export default Header