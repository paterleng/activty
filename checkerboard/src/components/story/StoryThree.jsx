import './Story.css';
import Header from "../header/Header.jsx";

const StoryThree = () => {
    return (
        <div className='second-div' style={{position: 'relative'}}>
            <Header/>
            <div className='three-div-main'>
                <div className="three-div-top">
                    <div className="three-image-top-inner">
                        <img src="/images/picture/three-one.png" alt="Example"/>
                    </div>
                    <div className="three-div-top-right">
                        <div style={{marginLeft:'70px'}}>HOW TO GET</div>
                        <div style={{color:'#F5E01B',marginLeft:'70px'}}>$CHICO?</div>
                    </div>
                </div>
                <div className="three-div-middle">
                    <div className='three-div-middle-font'>
                        "Get Fired Up:
                        Trade Boldly,
                        Bark Loudly!"
                    </div>
                </div>
                <div className="three-div-middle-fit-dog">
                    <img src="/images/picture/three-fit-dog.png" alt="Example"/>
                </div>
                <div className='three-div-bottom'>
                    <div className='three-image-bottom-dog'>
                        <img src="/images/picture/three-silam-dog.png" alt="Example"/>
                    </div>
                    <div className='three-buttom-div-text-one'>
                        <div className='three-buttom-div-text-title'>Step2</div>
                        <div className='three-buttom-div-text-content'>In order to protect the magic treasure from being invaded, Chico always goes out to find magical energy shields to protect the area he occupies from harm.</div>
                    </div>
                    <div>
                        <div className='three-buttom-div-text-two'>
                            <div className='three-buttom-div-text-title'>Step1</div>
                            <div className='three-buttom-div-text-content'>Chico will put your staked SOL into the magical treasure, where players will get 0.5% of the profit every hour.
                            </div>
                        </div>
                        <div className='three-buttom-div-text-three'>
                            <div className='three-buttom-div-text-title'>Step3</div>
                            <div className='three-buttom-div-text-content'>Harvest your chihuahua coin tokens, which are the rewards for the brave and deserved!
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default StoryThree;



