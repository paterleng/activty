// 返回主页
import {useNavigate} from "react-router-dom";

const GoHome = () => {
    const navigate = useNavigate();
    const goHome = () =>{
        navigate('/')
    }
    const style = {
        width:'200rem',
        height:'40rem',
        backgroundColor:'#F5E01B',
        border:'1rem solid #F5E01B',
        borderRadius:'12rem',
        position:'absolute',
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