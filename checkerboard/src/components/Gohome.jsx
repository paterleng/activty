// 返回主页
import {useNavigate} from "react-router-dom";

const GoHome = () => {
    const navigate = useNavigate();
    const goHome = () =>{
        navigate('/')
    }
    const style = {
        width:'200px',
        height:'40px',
        backgroundColor:'#2ff519',
        borderRadius:'10px',
        position:'absolute',
        top:'-30px',
        fontWeight:'bolder',
        cursor:'pointer',
    }
    return (
        <div style={{display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignItems: 'center',position: 'relative'}}>
                <button style={style} onClick={goHome}>
                    Let's DIG!
                </button>
        </div>
    );
};

export default GoHome;