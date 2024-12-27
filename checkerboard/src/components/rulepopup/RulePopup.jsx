import './RulePupup.css'
import { useNavigate } from 'react-router-dom';
import { Divider } from "antd";

const RulePopup = () => {
    const navigate = useNavigate();
    const ruleClickHandle = () => {
        navigate("/rule")
    }
    const story = ()=>{
        navigate("/first")
    }
    return (
        <div className='rule-box'>
           <div className='rule-box-in'>
                <div onClick={story} className='style-margin'>Review Story</div>
                <Divider
                    style={{
                        borderColor: '#000000',
                    }}
                    >
                </Divider>
                <div className='style-margin' onClick={ruleClickHandle}>Rules</div>
           </div>
        </div>
    );
};

export default RulePopup;