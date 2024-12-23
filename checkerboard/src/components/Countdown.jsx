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

    const formatTime = (totalSeconds) => {
        const days = Math.floor(totalSeconds / (24 * 60 * 60));
        const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        const secs = totalSeconds % 60;
        const dayPart = days > 0 ? `${days}天 ` : '';
        const hourPart = hours > 0 ? `${String(hours).padStart(2, '0')}时 ` : '';
        const minutePart = minutes > 0 ? `${String(minutes).padStart(2, '0')}分 ` : '';
        const secondPart = `${String(secs).padStart(2, '0')}秒`;

        return `${dayPart}${hourPart}${minutePart}${secondPart}`;
    };


    return (
        <div style={styles.container}>
            <h1 style={styles.time}>距护盾结束还有:{seconds > 0 ? formatTime(seconds) : ''}</h1>
        </div>
    );
};

// 样式定义
const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
    },
    time: {
        fontSize: '16px',
        fontWeight: 'bold',
    },
};

Countdown.propTypes = {
    initialSeconds: PropTypes.number.isRequired,
};


export default Countdown;
