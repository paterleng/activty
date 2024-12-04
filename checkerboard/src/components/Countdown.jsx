import React, { useState, useEffect } from 'react';

const Countdown = ({ initialSeconds }) => {
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {
        if (seconds <= 0) return;

        const timer = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer); // 清除定时器，防止内存泄漏
    }, [seconds]);

    // 格式化时间为 mm:ss
    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.time}>{seconds > 0 ? formatTime(seconds) : '结束'}</h1>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '20px',
        weight: '100px',
        backgroundColor: 'transparent', // 背景色设置为透明
        color: '#333', // 文字颜色为黑色
        fontFamily: 'Arial, sans-serif',
        padding: '10px 20px', // 内边距调整，增加舒适感
        borderRadius: '8px', // 添加圆角
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // 添加轻微阴影，使组件有浮动效果
    },
    time: {
        fontSize: '12px', // 调整字体大小
        fontWeight: 'bold',
        color: '#333', // 字体颜色
    },
};

export default Countdown;
