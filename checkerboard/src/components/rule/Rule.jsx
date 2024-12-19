import Header from "../header/Header.jsx";
import {useNavigate} from "react-router-dom";
import './Rule.css'
import Scrollbar from "../scrollbar/Scrollbar.jsx";
import GoHome from "../Gohome.jsx";

const Rule = () => {
    const navigate = useNavigate();
    const goHome = () =>{
        navigate('/')
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignItems: 'center'}}>
            <Header/>
            <div className='external'>
                <div className='internal'>
                    <div>
                        <h1>RULES</h1>
                    </div>
                    <Scrollbar/>
                </div>
            </div>
            <GoHome />
        </div>
    );
};

export default Rule;