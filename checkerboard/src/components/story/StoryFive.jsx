import './Story.css';
import Header from "../header/Header.jsx";
import {useNavigate} from "react-router-dom";

const StoryFive = () => {
    const navigate = useNavigate();
    const goGame= ()=>{
        navigate('/')
    }
    return (
        <div className='five-div' style={{position: 'relative'}}>
            <Header/>
            <div className='five-step-one'>
                <div className='fiv-text-div'>
                    <div className="five-div-color"></div>
                    <div className='five-div-title'>Step1</div>
                </div>
                <div className='five-div-content'>Community Meme with Anger Culture</div>
            </div>
            <div className='five-step-two'>
                <div className='fiv-text-div'>
                    <div className="five-div-color"></div>
                    <div className='five-div-title'>Step2</div>
                </div>
                <div className='five-div-content'>Gamified 100% Fair Launch for $CHICO</div>
            </div>
            <div onClick={goGame} className='five-dog'>
                <img src='./images/picture/five-dog.png' alt="Example"/>
            </div>
            <div className='five-step-three'>
                <div className='fiv-text-div'>
                    <div className="five-div-color"></div>
                    <div className='five-div-title'>Step3</div>
                </div>
                <div className='five-div-content'>To the Moon Meme: Trade Boldly, Bark Loudly!</div>
            </div>
            <div className='five-step-four'>
                <div className='fiv-text-div'>
                    <div className="five-div-color"></div>
                    <div className='five-div-title'>Step4</div>
                </div>
                <div className='five-div-content'>Gamified Meme Launchpad for Thousands of Memes</div>
            </div>
        </div>
    );
};

export default StoryFive;



