import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Countdown = ({initialSeconds}) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    useEffect(() => {
        if (seconds <= 0) return;
        const timer = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer); // 清除定时器，防止内存泄漏
    }, [seconds]);

    // const formatTime = (totalSeconds) => {
    //     const days = Math.floor(totalSeconds / (24 * 60 * 60));
    //     const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    //     const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    //     const secs = totalSeconds % 60;
    //     const dayPart = days > 0 ? `${days}天 ` : '';
    //     const hourPart = hours > 0 ? `${String(hours).padStart(2, '0')}时 ` : '';
    //     const minutePart = minutes > 0 ? `${String(minutes).padStart(2, '0')}分 ` : '';
    //     const secondPart = `${String(secs).padStart(2, '0')}秒`;
    //     return `${dayPart}${hourPart}${minutePart}${secondPart}`;
    // };
    const formatHours = (totalSeconds) => {
        const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
        return hours
    }
    const formatMinutes = (totalSeconds) => {
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        const minutePart = minutes > 0 ? `${String(minutes).padStart(2, '0')} ` : '';
        return minutePart
    }
    const formatSecs = (totalSeconds) => {
        const secs = totalSeconds % 60;
        const secondPart = `${String(secs).padStart(2, '0')}`;
        return secondPart
    }

    return (
        <div style={styles.container}>
            {/* <h1 style={styles.time}>{seconds > 0 ? formatTime(seconds) : ''}</h1> */}
            <div style={{color:'#ffffff',fontSize:'20px'}}>
                <div style={styles.span1}>{seconds > 0 ? formatHours(seconds) : ''}</div>
                 : 
                <div style={styles.span2}>{seconds > 0 ? formatMinutes(seconds) : ''}</div>
                 : 
                <div style={styles.span2}>{seconds > 0 ? formatSecs(seconds) : ''}</div>
            </div>
        </div>
    );
};

// 样式定义
const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
    },
    time: {
        fontSize: '16rem',
        fontWeight: 'bold',
    },
    span1:{
        display:'inline-block',
        width:'45px',
        height:'25px',
        fontSize:20,
        fontWeight:700,
        backgroundColor:'#262626',
        marginRight:'5px',
        color:'#ffffff',
        textAlign: 'center',
        paddingTop:'3px',
        borderRadius: '2px'
    },
    span2:{
        display:'inline-block',
        width:'45px',
        height:'25px',
        fontSize:20,
        fontWeight:700,
        backgroundColor:'#262626',
        margin:'5px',
        color:'#ffffff',
        textAlign: 'center',
        paddingTop:'3px',
        borderRadius: '2px'
    }
};

Countdown.propTypes = {
    initialSeconds: PropTypes.number.isRequired,
};


export default Countdown;
