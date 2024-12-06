import Translation from '../translation/Translation';
import './header.css'


const Header = () => {
    return (
        <div className='header-box'>
            <div className='left-box'> 
                <a>test</a>     
            </div>
            <div className='right-box'>
                <div>Get Token!</div>
                <div>
                    <Translation />
                </div>
            </div>
        </div>
    );
};

export default Header