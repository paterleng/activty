import Header from "../header/Header.jsx";
import './Rule.css'
import Scrollbar from "../scrollbar/Scrollbar.jsx";
import GoHome from "../Gohome.jsx";

const Rule = () => {
    return (
        <div style={{display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignItems: 'center'}}>
            <Header/>
            <div className='external'>
                <div className='internal'>
                    <div style={{fontSize:'22rem'}}>
                        <h1>RULES</h1>
                    </div>
                    <Scrollbar/>
                </div>
            </div>
            <GoHome/>
        </div>
    );
};

export default Rule;