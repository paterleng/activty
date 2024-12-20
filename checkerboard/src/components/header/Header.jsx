import Translation from '../translation/Translation';
import './header.css'
import {Avatar, message} from "antd";
import ConnectWallet from "../web3wallet/Wallet.jsx";


const Header = () => {
    return (
        <div className='header-box'>
            <div className='left-div'>
                <div className='logo'>
                    <Avatar
                        size={{xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100}}
                        src="/images/logo/logo.png"
                        style={{cursor: 'pointer', height: '24px', width: '24px',marginRight: '20px'}}
                    />
                    <span className='logo-span'>
                        Stake and wait makes CHICO reward
                    </span>
                </div>
                <div className='left-box'>
                    <div className='left-box-img'>
                        <a href="https://www.todesk.com/download.html" target="_blank" rel="noopener noreferrer">
                            <Avatar
                                size={{xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100}}
                                src="/images/style/x.png"
                                style={{cursor: 'pointer', height: '40px', width: '40px'}}
                            />
                        </a>
                    </div>
                    <div className='left-box-img'>
                        <a href="https://www.todesk.com/download.html" target="_blank" rel="noopener noreferrer">
                            <Avatar
                                size={{xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100}}
                                src="/images/style/tg.png"
                                style={{cursor: 'pointer', height: '40px', width: '40px'}}
                            />
                        </a>
                    </div>
                </div>
            </div>
            <div className='right-box'>
                <button className="dig-for">DIG FOR $CHIHUAHUA</button>
                <ConnectWallet />
                <Translation />
            </div>
        </div>
    );
};

export default Header